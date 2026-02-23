import express from "express";
const router = express.Router();
import authController from "../controllers/authController";

/**
 * @swagger
 * components:
 * schemas:
 * RegisterRequest:
 * type: object
 * required:
 * - email
 * - password
 * - username
 * properties:
 * email:
 * type: string
 * format: email
 * password:
 * type: string
 * format: password
 * username:
 * type: string
 * profilePic:
 * type: string
 * description: URL of the uploaded profile picture
 * AuthResponse:
 * type: object
 * properties:
 * token:
 * type: string
 * description: JWT access token
 * refreshToken:
 * type: string
 * description: JWT refresh token
 * username:
 * type: string
 * description: User's username
 * userProfilePic:
 * type: string
 * description: URL to the user's profile picture
 */

/**
 * @swagger
 * /auth/register:
 * post:
 * summary: Register a new user
 * description: Create a new user account with email, password, username, and profile picture
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
 * $ref: '#/components/schemas/AuthResponse'
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
 * summary: Login user
 * description: Authenticate a user using email and password
 * tags: [Authentication]
 * security: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * example: "user@example.com"
 * password:
 * type: string
 * example: "password123"
 * responses:
 * 200:
 * description: User successfully authenticated
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AuthResponse'
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
 * description: Obtain a new access token using a refresh token
 * tags: [Authentication]
 * security: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * refreshToken:
 * type: string
 * description: The user's refresh token
 * responses:
 * 200:
 * description: Token successfully refreshed
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * token:
 * type: string
 * description: New JWT access token
 * refreshToken:
 * type: string
 * description: New JWT refresh token
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
 * responses:
 * 200:
 * description: User successfully authenticated via Google
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AuthResponse'
 * 400:
 * $ref: '#/components/responses/ValidationError'
 * 500:
 * $ref: '#/components/responses/ServerError'
 */
router.post("/google", authController.googleLogin);

export default router;