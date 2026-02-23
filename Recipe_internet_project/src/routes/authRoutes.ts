import express from "express";
const router = express.Router();
import authController from "../controllers/authController";

/**
 * @swagger
 * /auth/register:
 * post:
 * summary: Register a new user
 * description: Create a new user account with email and password
 * tags: [Authentication]
 * security: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/RegisterRequest'
 * responses:
 * 201:
 * description: User successfully registered
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * token:
 * type: string
 * description: JWT access token
 * example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * refreshToken:
 * type: string
 * description: JWT refresh token
 * example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 * 400:
 * $ref: '#/components/responses/ValidationError'
 * 500:
 * $ref: '#/components/responses/ServerError'
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 * post:
 * summary: User login
 * description: Authenticate user with email and password
 * tags: [Authentication]
 * security: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/LoginRequest'
 * responses:
 * 200:
 * description: User successfully authenticated
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * token:
 * type: string
 * description: JWT access token
 * example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * refreshToken:
 * type: string
 * description: JWT refresh token
 * example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * 400:
 * $ref: '#/components/responses/ValidationError'
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 * 500:
 * $ref: '#/components/responses/ServerError'
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/refresh-token:
 * post:
 * summary: Refresh access token
 * description: Generate new access and refresh tokens using a valid refresh token
 * tags: [Authentication]
 * security: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/RefreshTokenRequest'
 * responses:
 * 200:
 * description: Tokens successfully refreshed
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * token:
 * type: string
 * description: New JWT access token
 * example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * refreshToken:
 * type: string
 * description: New JWT refresh token
 * example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 * 400:
 * $ref: '#/components/responses/ValidationError'
 * 500:
 * $ref: '#/components/responses/ServerError'
 */
router.post("/refresh-token", authController.refreshToken);

/**
 * @swagger
 * /auth/google:
 * post:
 * summary: Login or Register with Google
 * description: Authenticate a user using a Google credential token
 * tags: [Authentication]
 * security: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * credential:
 * type: string
 * description: The Google ID token received from the frontend
 * example: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjRiM..."
 * responses:
 * 200:
 * description: User successfully authenticated via Google
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * token:
 * type: string
 * refreshToken:
 * type: string
 * email:
 * type: string
 * username:
 * type: string
 * userProfilePic:
 * type: string
 * 401:
 * description: Invalid Google token
 * 500:
 * $ref: '#/components/responses/ServerError'
 */
router.post("/google", authController.googleLogin);

export default router;