import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// הגדרת טיפוס הבקשה כדי ש-TypeScript יכיר את שדה user
export interface AuthRequest extends Request {
    user?: { _id: string };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const secret: string = process.env.JWT_SECRET || "secretkey";

    try {
        const decoded = jwt.verify(token, secret) as { userId: string };
        // שומרים את ה-ID תחת _id כדי להתאים לקונטרולרים
        req.user = { _id: decoded.userId };
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
};

export default authMiddleware;