import { Request, Response, NextFunction } from "express";
import User from "../model/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

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
    const exp: number = parseInt(process.env.JWT_EXPIRES_IN || "3600");
    const refreshexp: number = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || "86400");
    const token = jwt.sign(
        { userId: userId },
        secret,
        { expiresIn: exp }
    );
    const refreshToken = jwt.sign(
        { userId: userId },
        secret,
        { expiresIn: refreshexp }
    );
    return { token, refreshToken };
}

const register = async (req: Request, res: Response) => {
    const { email, password, username, profilePic } = req.body;

    if (!email || !password || !username) {
        return sendError(res, "Email, password and username are required", 400);
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ 
            email, 
            password: encryptedPassword,
            username,
            profilePic: profilePic || "/avatar.png"
        });

        const tokens = generateToken(user._id.toString());
        
        if (!user.refreshToken) user.refreshToken = [];
        user.refreshToken.push(tokens.refreshToken);
        await user.save();

        res.status(201).json({
            ...tokens,
            username: user.username,
            userProfilePic: user.profilePic,
            email: user.email
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return sendError(res, "Email or Username already exists", 400);
        }
        return sendError(res, "Registration failed", 500);
    }
};

const login = async (req: Request, res: Response) => {
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
        res.status(200).json({
            ...tokens,
            email: user.email,
            username: user.username,
            userProfilePic: user.profilePic
        });
    } catch (error) {
        return sendError(res, "Login failed");
    }
};

const refreshToken = async (req: Request, res: Response) => {
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

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req: Request, res: Response) => {
    try {
        const { credential } = req.body;
        
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        if (!payload) return sendError(res, "Invalid Google token", 401);

        const { email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = await User.create({
                email,
                password: hashedPassword,
                username: name || email?.split('@')[0],
                profilePic: picture || "/avatar.png"   
            });
        }

        const tokens = generateToken(user._id.toString());
        if (!user.refreshToken) user.refreshToken = [];
        user.refreshToken.push(tokens.refreshToken);
        await user.save();

        res.status(200).json({
            ...tokens,
            email: user.email,
            username: user.username,
            userProfilePic: user.profilePic
        });
    } catch (error) {
        console.error("Google login error:", error);
        return sendError(res, "Google login failed", 500);
    }
};

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

export default {
    register,
    login,
    refreshToken,
    googleLogin,
    protect
};