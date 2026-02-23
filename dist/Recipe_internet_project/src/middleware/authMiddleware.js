"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    console.log("Authorization Header:", req.headers.authorization); // Log the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("Missing or invalid Authorization header"); // Log error for missing/invalid header
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "secretkey";
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        console.log("Decoded Token:", decoded); // Log the decoded token
        req.user = { _id: decoded.userId };
        next();
    }
    catch (error) {
        console.error("Token verification failed:", error); // Log token verification failure
        return res.status(401).json({ error: "Unauthorized" });
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map