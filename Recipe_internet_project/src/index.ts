//import 'express-async-errors'; 
import express, { Express } from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.dev" });
import cors from "cors";
import recipeRoutes from "./routes/recipesRoutes"; // recipes router
import commentRoutes from "./routes/commentRoutes";
import authRoutes from "./routes/authRoutes";
import { specs, swaggerUi } from "./swagger";

const intApp = () => {
  const promise = new Promise<Express>((resolve, reject) => {
    // Enable CORS for frontend communication
    app.use(cors({
      origin: "http://localhost:5000", // Allow requests from React frontend
      credentials: true
    }));
    
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

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
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Recipe & Comments API Documentation" // הכותרת שונתה
    }));

    // Swagger JSON endpoint
    app.get("/api-docs.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(specs);
    });

    app.use("/recipes", recipeRoutes); // recipes endpoints
    app.use("/comment", commentRoutes);
    app.use("/auth", authRoutes);

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
