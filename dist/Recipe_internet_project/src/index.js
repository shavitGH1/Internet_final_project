"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env.dev" });
const cors_1 = __importDefault(require("cors"));
const recipesRoutes_1 = __importDefault(require("./routes/recipesRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const swagger_1 = require("./swagger");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadDir = 'uploads';
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// -----------------------------------
const intApp = () => {
    const promise = new Promise((resolve, reject) => {
        const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
        app.use((0, cors_1.default)({
            origin: frontendOrigin,
            credentials: true,
            methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
        app.use(express_1.default.json({ limit: '50mb' }));
        app.use('/uploads', express_1.default.static('uploads'));
        app.use((req, res, next) => {
            const startTime = Date.now();
            res.on('finish', () => {
                const duration = Date.now() - startTime;
                console.log(`${new Date().toISOString()} [${req.method}] ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`);
            });
            next();
        });
        app.use("/api-docs", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.specs, {
            explorer: true,
            customCss: ".swagger-ui .topbar { display: none }",
            customSiteTitle: "Recipe & Comments API Documentation"
        }));
        app.get("/api-docs.json", (req, res) => {
            res.setHeader("Content-Type", "application/json");
            res.send(swagger_1.specs);
        });
        /**
         * @swagger
         * /upload:
         * post:
         * summary: Upload an image file
         * description: Uploads a single image file to the server and returns the public URL.
         * tags: [Upload]
         * requestBody:
         * required: true
         * content:
         * multipart/form-data:
         * schema:
         * type: object
         * properties:
         * file:
         * type: string
         * format: binary
         * responses:
         * 200:
         * description: File uploaded successfully
         * content:
         * application/json:
         * schema:
         * type: object
         * properties:
         * url:
         * type: string
         */
        app.post('/upload', upload.single('file'), (req, res) => {
            if (!req.file) {
                return res.status(400).send('No file uploaded.');
            }
            const fullUrl = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
            res.status(200).json({ url: fullUrl });
        });
        app.use("/recipes", recipesRoutes_1.default);
        app.use("/comments", commentRoutes_1.default);
        app.use("/auth", authRoutes_1.default);
        app.use("/user", userRoute_1.default);
        const dbUri = process.env.MONGODB_URI;
        if (!dbUri) {
            console.error("MONGODB_URI is not defined in the environment variables.");
            reject(new Error("MONGODB_URI is not defined"));
        }
        else {
            mongoose_1.default
                .connect(dbUri)
                .then(() => {
                console.log("✓ Connected to MongoDB");
                resolve(app);
            })
                .catch((error) => {
                console.error("✗ Error connecting to MongoDB:", error.message);
                reject(error);
            });
        }
    });
    return promise;
};
exports.default = intApp;
//# sourceMappingURL=index.js.map