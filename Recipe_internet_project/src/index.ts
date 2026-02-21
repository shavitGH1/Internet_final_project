import express, { Express } from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.dev" });
import cors from "cors";
import recipeRoutes from "./routes/recipesRoutes"; 
import commentRoutes from "./routes/commentRoutes";
import authRoutes from "./routes/authRoutes";
import userRoute from "./routes/userRoute"; 
import { specs, swaggerUi } from "./swagger";

const intApp = () => {
  const promise = new Promise<Express>((resolve, reject) => {
    const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
    app.use(cors({
      origin: frontendOrigin,
      credentials: true,
      methods: ['GET','POST','PATCH','PUT','DELETE','OPTIONS'],
      allowedHeaders: ['Content-Type','Authorization']
    }));
    
    app.use(express.urlencoded({ extended: false, limit: '50mb' }));
    app.use(express.json({ limit: '50mb' }));

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

    app.use("/recipes", recipeRoutes); 
    app.use("/comment", commentRoutes);
    app.use("/auth", authRoutes);
    app.use("/user", userRoute); 

    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      console.error("MONGODB_URI is not defined in the environment variables.");
      reject(new Error("MONGODB_URI is not defined"));
    } else {
      mongoose
        .connect(dbUri, {})
        .then(() => {
          resolve(app);
        });
    }
    const db = mongoose.connection;
    db.on("error", (error) => {
      console.error(error);
    });
    db.once("open", () => {
      console.log("Connected to MongoDB");
    });
  });
  return promise;
};

export default intApp;