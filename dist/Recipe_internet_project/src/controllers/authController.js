"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../model/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const sendError = (res, message, code) => {
    const errCode = code || 400;
    res.status(errCode).json({ error: message });
};
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || "secretkey";
    const exp = parseInt(process.env.JWT_EXPIRES_IN || "3600");
    const refreshexp = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || "86400");
    const token = jsonwebtoken_1.default.sign({ userId: userId }, secret, { expiresIn: exp });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: userId }, secret, { expiresIn: refreshexp });
    return { token, refreshToken };
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username, profilePic } = req.body;
    if (!email || !password || !username) {
        return sendError(res, "Email, password and username are required", 400);
    }
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield userModel_1.default.create({
            email,
            password: encryptedPassword,
            username,
            profilePic: profilePic || "/avatar.png"
        });
        const tokens = generateToken(user._id.toString());
        if (!user.refreshToken)
            user.refreshToken = [];
        user.refreshToken.push(tokens.refreshToken);
        yield user.save();
        res.status(201).json(Object.assign(Object.assign({}, tokens), { username: user.username, userProfilePic: user.profilePic, email: user.email }));
    }
    catch (error) {
        if (error.code === 11000) {
            return sendError(res, "Email or Username already exists", 400);
        }
        return sendError(res, "Registration failed", 500);
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return sendError(res, "Email and password are required");
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user)
            return sendError(res, "Invalid email or password");
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            return sendError(res, "Invalid email or password");
        const tokens = generateToken(user._id.toString());
        user.refreshToken.push(tokens.refreshToken);
        yield user.save();
        res.status(200).json(Object.assign(Object.assign({}, tokens), { email: user.email, username: user.username, userProfilePic: user.profilePic }));
    }
    catch (error) {
        return sendError(res, "Login failed");
    }
});
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return sendError(res, "Refresh token is required", 401);
    try {
        const secret = process.env.JWT_SECRET || "secretkey";
        const decoded = jsonwebtoken_1.default.verify(refreshToken, secret);
        const user = yield userModel_1.default.findById(decoded.userId);
        if (!user)
            return sendError(res, "Invalid refresh token", 401);
        if (!user.refreshToken.includes(refreshToken)) {
            user.refreshToken = [];
            yield user.save();
            return sendError(res, "Invalid refresh token", 401);
        }
        const tokens = generateToken(user._id.toString());
        user.refreshToken.push(tokens.refreshToken);
        user.refreshToken = user.refreshToken.filter(rt => rt !== refreshToken);
        yield user.save();
        res.status(200).json(tokens);
    }
    catch (error) {
        return sendError(res, "Invalid refresh token", 401);
    }
});
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { credential } = req.body;
        const ticket = yield googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload)
            return sendError(res, "Invalid Google token", 401);
        const { email, name, picture } = payload;
        let user = yield userModel_1.default.findOne({ email });
        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(randomPassword, salt);
            user = yield userModel_1.default.create({
                email,
                password: hashedPassword,
                username: name || (email === null || email === void 0 ? void 0 : email.split('@')[0]),
                profilePic: picture || "/avatar.png"
            });
        }
        const tokens = generateToken(user._id.toString());
        if (!user.refreshToken)
            user.refreshToken = [];
        user.refreshToken.push(tokens.refreshToken);
        yield user.save();
        res.status(200).json(Object.assign(Object.assign({}, tokens), { email: user.email, username: user.username, userProfilePic: user.profilePic }));
    }
    catch (error) {
        console.error("Google login error:", error);
        return sendError(res, "Google login failed", 500);
    }
});
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "secretkey";
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = { _id: decoded.userId };
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
});
exports.default = {
    register,
    login,
    refreshToken,
    googleLogin,
    protect
};
//# sourceMappingURL=authController.js.map