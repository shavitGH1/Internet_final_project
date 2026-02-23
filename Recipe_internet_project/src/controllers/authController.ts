import { Request, Response } from "express";
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
    
    const exp = Number(process.env.JWT_EXPIRES_IN) || 3600;
    const refreshexp = Number(process.env.JWT_REFRESH_EXPIRES_IN) || 86400;

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
    if (!email || !password || !username) return sendError(res, "Missing fields", 400);

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
        user.refreshToken = [tokens.refreshToken];
        await user.save();

        res.status(201).json({
            ...tokens,
            username: user.username,
            userProfilePic: user.profilePic,
            email: user.email
        });
    } catch (error: any) {
        if (error.code === 11000) return sendError(res, "Email or Username already exists", 400);
        return sendError(res, "Registration failed", 500);
    }
};

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return sendError(res, "Invalid credentials", 401);
        }
        const tokens = generateToken(user._id.toString());
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).json({ ...tokens, username: user.username, userProfilePic: user.profilePic });
    } catch (error) {
        return sendError(res, "Login failed", 500);
    }
};

const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken: token } = req.body;
    if (!token) return sendError(res, "Missing token", 401);
    try {
        const secret = process.env.JWT_SECRET || "secretkey";
        const decoded: any = jwt.verify(token, secret);
        const user = await User.findById(decoded.userId);
        if (!user || !user.refreshToken.includes(token)) return sendError(res, "Invalid token", 401);
        
        const tokens = generateToken(user._id.toString());
        user.refreshToken = user.refreshToken.filter(rt => rt !== token);
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).json(tokens);
    } catch (error) {
        return sendError(res, "Invalid token", 401);
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

        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = await User.create({
                email: payload.email,
                password: await bcrypt.hash(Math.random().toString(), 10),
                username: payload.name,
                profilePic: payload.picture
            });
        }
        const tokens = generateToken(user._id.toString());
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).json({ ...tokens, username: user.username, userProfilePic: user.profilePic });
    } catch (error) {
        return sendError(res, "Google login failed", 500);
    }
};



export default { register, login, refreshToken, googleLogin };