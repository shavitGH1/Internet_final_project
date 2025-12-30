import { Request, Response, NextFunction } from "express";
import User from "../model/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const sendError = (res: Response, message: string, code?: number) => {
    const errCode = code || 400;
    res.status(errCode).json({ error: message });
}

type Tokens = {
    token: string;
    refreshToken: string;
}
const generateToken = (userId: string): Tokens => {
    const secret: string = process.env.JWT_SECRET || "secretkey";
    const exp: number = parseInt(process.env.JWT_EXPIRES_IN || "3600"); // 1 hour
    const refreshexp: number = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || "86400"); // 24 hours
    const token = jwt.sign(
        { userId: userId },
        secret,
        { expiresIn: exp }
    );
    const refreshToken = jwt.sign(
        { userId: userId },
        secret,
        { expiresIn: refreshexp } // 24 hours
    );
    return { token, refreshToken };
}
const register = async (req: Request, res: Response) => {
    // ... (logic as before)
    const { email, password } = req.body;
    if (!email || !password) return sendError(res, "Email and password are required", 401);
    try {
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ email, password: encryptedPassword });
        const tokens = generateToken(user._id.toString());
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(201).json(tokens);
    } catch (error) {
        return sendError(res, "Registration failed", 401);
    }
};

const login = async (req: Request, res: Response) => {
    // ... (logic as before)
    const { email, password } = req.body;
    if (!email || !password) return sendError(res, "Email and password are required");
    try {
        const user = await User.findOne({ email });
        if (!user) return sendError(res, "Invalid email or password");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return sendError(res, "Invalid email or password");
        const tokens = generateToken(user._id.toString());
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).json(tokens);
    } catch (error) {
        return sendError(res, "Login failed");
    }
};

const refreshToken = async (req: Request, res: Response) => {
    // ... (logic as before)
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, "Refresh token is required", 401);
    try {
        const secret: string = process.env.JWT_SECRET || "secretkey";
        const decoded: any = jwt.verify(refreshToken, secret);
        const user = await User.findById(decoded.userId);
        if (!user) return sendError(res, "Invalid refresh token", 401);
        if (!user.refreshToken.includes(refreshToken)) {
            user.refreshToken = [];
            await user.save();
            return sendError(res, "Invalid refresh token", 401);
        }
        const tokens = generateToken(user._id.toString());
        user.refreshToken.push(tokens.refreshToken);
        user.refreshToken = user.refreshToken.filter(rt => rt !== refreshToken);
        await user.save();
        res.status(200).json(tokens);
    } catch (error) {
        return sendError(res, "Invalid refresh token", 401);
    }
};

// --- פונקציות ה-middleware שנוספו מקובץ ה-middleware.ts ---

// הגדרת טיפוס מותאם אישית עבור האובייקט Request
export type AuthRequest = Request & { user?: any }; 

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const secret: string = process.env.JWT_SECRET || "secretkey";

    try {
        const decoded = jwt.verify(token, secret) as { userId: string };
        req.user = { _id: decoded.userId };
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
};

const restrictTo = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        // יש לוודא שהמודל של User כולל שדה 'role'
        if (!req.user || !roles.includes(req.user.role)) { 
            return sendError(res, 'You do not have permission to perform this action', 403);
        }
        next();
    };
};

// --- עדכון הייצוא הראשי לכלול את כל הפונקציות ---

export default {
    register,
    login,
    refreshToken,
    protect,     // נוסף
    restrictTo   // נוסף
};
