import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export type AuthRequest = Request & { user?: { _id: string } };

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("Authorization Header:", req.headers.authorization); // Log the Authorization header

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("Missing or invalid Authorization header"); // Log error for missing/invalid header
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const secret: string = process.env.JWT_SECRET || "secretkey";

    try {
        const decoded = jwt.verify(token, secret) as { userId: string };
        console.log("Decoded Token:", decoded); // Log the decoded token
        req.user = { _id: decoded.userId };
        next();
    } catch (error) {
        console.error("Token verification failed:", error); // Log token verification failure
        return res.status(401).json({ error: "Unauthorized" });
    }
};


export default authMiddleware;