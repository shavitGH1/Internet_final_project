import express, { Express } from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
const envFile = process.env.NODE_ENV === 'test' ? ".env.test" : ".env.dev";
dotenv.config({ path: envFile });
import cors from "cors";
import recipeRoutes from "./routes/recipesRoutes"; 
import commentRoutes from "./routes/commentRoutes";
import authRoutes from "./routes/authRoutes";
import userRoute from "./routes/userRoute"; 
import { specs, swaggerUi } from "./swagger";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); 
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });
// -----------------------------------

const intApp = () => {
  const promise = new Promise<Express>((resolve, reject) => {
    const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
    app.use(cors({
      origin: frontendOrigin,
      credentials: true,
      methods: ['GET','POST','PATCH','PUT','DELETE','OPTIONS'],
      allowedHeaders: ['Content-Type','Authorization']
    }));
    
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(express.json({ limit: '50mb' }));

    app.use('/uploads', express.static('uploads'));

    app.use((req, res, next) => {
      const startTime = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`${new Date().toISOString()} [${req.method}] ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`);
      });
      next();
    });

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Recipe & Comments API Documentation" 
    }));

    app.get("/api-docs.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(specs);
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

    app.use("/recipes", recipeRoutes); 
    app.use("/comments", commentRoutes);
    app.use("/auth", authRoutes);
    app.use("/user", userRoute); 

    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      console.error("MONGODB_URI is not defined in the environment variables.");
      reject(new Error("MONGODB_URI is not defined"));
    } else {
      mongoose
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

export default intApp;