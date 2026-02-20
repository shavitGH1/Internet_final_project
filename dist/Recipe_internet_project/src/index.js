"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import 'express-async-errors'; 
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env.dev" });
const cors_1 = __importDefault(require("cors"));
const recipesRoutes_1 = __importDefault(require("./routes/recipesRoutes")); // recipes router
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const swagger_1 = require("./swagger");
const intApp = () => {
    const promise = new Promise((resolve, reject) => {
        // Enable CORS for frontend communication
        // Use FRONTEND_URL env var when set, otherwise default to localhost:3000
        const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
        app.use((0, cors_1.default)({
            origin: frontendOrigin,
            credentials: true,
            methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        app.use(express_1.default.urlencoded({ extended: false }));
        app.use(express_1.default.json());
        // Request logging middleware
        app.use((req, res, next) => {
            const startTime = Date.now();
            res.on('finish', () => {
                const duration = Date.now() - startTime;
                console.log(`${new Date().toISOString()} [${req.method}] ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`);
            });
            next();
        });
        // Swagger Documentation
        app.use("/api-docs", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.specs, {
            explorer: true,
            customCss: ".swagger-ui .topbar { display: none }",
            customSiteTitle: "Recipe & Comments API Documentation" // הכותרת שונתה
        }));
        // Swagger JSON endpoint
        app.get("/api-docs.json", (req, res) => {
            res.setHeader("Content-Type", "application/json");
            res.send(swagger_1.specs);
        });
        app.use("/recipes", recipesRoutes_1.default); // recipes endpoints
        app.use("/comment", commentRoutes_1.default);
        app.use("/auth", authRoutes_1.default);
        const dbUri = process.env.MONGODB_URI;
        if (!dbUri) {
            console.error("MONGODB_URI is not defined in the environment variables.");
            reject(new Error("MONGODB_URI is not defined"));
        }
        else {
            mongoose_1.default
                .connect(dbUri, {})
                .then(() => {
                resolve(app);
            });
        }
        const db = mongoose_1.default.connection;
        db.on("error", (error) => {
            console.error(error);
        });
        db.once("open", () => {
            console.log("Connected to MongoDB");
        });
    });
    return promise;
};
exports.default = intApp;
//# sourceMappingURL=index.js.map