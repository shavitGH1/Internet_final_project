import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Recipe & Comments REST API",
            version: "1.0.0",
            description: "A REST API for managing recipes and comments with user authentication",
            contact: {
                name: "Menachi",
                email: "developer@example.com",
            },
        },
        servers: [
            {
                url: process.env.BASE_URL || "http://localhost:3000",
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "JWT authorization header using the Bearer scheme",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    required: ["email", "password", "username"],
                    properties: {
                        _id: {
                            type: "string",
                            description: "User unique identifier",
                            example: "507f1f77bcf86cd799439011",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description: "User email address",
                            example: "user@example.com",
                        },
                        password: {
                            type: "string",
                            minLength: 6,
                            description: "User password (hashed when stored)",
                            example: "password123",
                        },
                        username: {
                            type: "string",
                            description: "Unique username for the user",
                            example: "newUsername",
                        },
                        profilePic: {
                            type: "string",
                            description: "URL of the user's profile picture",
                            example: "/avatar.png",
                        },
                        refreshToken: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            description: "List of refresh tokens issued to the user",
                        },
                    },
                },
                Recipe: {
                    type: "object",
                    required: ["title", "ingredients", "steps", "cookingTime", "imageCover", "difficulty", "user"],
                    properties: {
                        _id: {
                            type: "string",
                            description: "Recipe unique identifier",
                            example: "507f1f77bcf86cd799439011",
                        },
                        title: {
                            type: "string",
                            description: "Recipe title",
                            example: "Spaghetti Carbonara",
                        },
                        ingredients: {
                            type: "array",
                            items: { type: "string" },
                            description: "List of ingredients",
                            example: ["Pasta", "Eggs", "Pancetta", "Parmesan"],
                        },
                        steps: {
                            type: "array",
                            items: { type: "string" },
                            description: "Step-by-step cooking instructions",
                            example: ["Boil pasta", "Cook pancetta", "Combine with eggs and cheese"],
                        },
                        cookingTime: {
                            type: "number",
                            description: "Cooking time in minutes",
                            example: 30,
                        },
                        imageCover: {
                            type: "string",
                            description: "Image URL for the recipe",
                            example: "https://example.com/recipe.jpg",
                        },
                        difficulty: {
                            type: "string",
                            enum: ["easy", "medium", "difficult"],
                            description: "Difficulty level",
                            example: "medium",
                        },
                        ratingsAverage: {
                            type: "number",
                            description: "Average rating",
                            example: 4.5,
                        },
                        ratingsQuantity: {
                            type: "number",
                            description: "Number of ratings",
                            example: 12,
                        },
                        user: {
                            type: "string",
                            description: "ID of the user who created this recipe",
                            example: "507f1f77bcf86cd799439011",
                        },
                        favorites: {
                            type: "array",
                            items: { type: "string" },
                            description: "List of user IDs who favorited the recipe",
                            example: ["user1", "user2"],
                        },
                    },
                },
                Comment: {
                    type: "object",
                    required: ["comment", "recipe", "user"],
                    properties: {
                        _id: {
                            type: "string",
                            description: "Comment unique identifier",
                            example: "507f1f77bcf86cd799439011",
                        },
                        comment: {
                            type: "string",
                            description: "Content of the comment",
                            example: "This recipe is amazing!",
                        },
                        recipe: {
                            type: "string",
                            description: "ID of the recipe the comment belongs to",
                            example: "507f1f77bcf86cd799439011",
                        },
                        user: {
                            type: "string",
                            description: "ID of the user who wrote the comment",
                            example: "507f1f77bcf86cd799439011",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Timestamp when the comment was created",
                            example: "2026-02-23T10:00:00Z",
                        },
                    },
                },
                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            example: "user@example.com",
                        },
                        password: {
                            type: "string",
                            example: "password123",
                        },
                    },
                },
                RegisterRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            example: "user@example.com",
                        },
                        password: {
                            type: "string",
                            minLength: 6,
                            example: "password123",
                        },
                    },
                },
                AuthResponse: {
                    type: "object",
                    properties: {
                        accessToken: {
                            type: "string",
                            description: "JWT access token",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        },
                        refreshToken: {
                            type: "string",
                            description: "JWT refresh token",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        },
                        user: {
                            $ref: "#/components/schemas/User",
                        },
                    },
                },
                RefreshTokenRequest: {
                    type: "object",
                    required: ["refreshToken"],
                    properties: {
                        refreshToken: {
                            type: "string",
                            description: "Valid refresh token",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Error message",
                            example: "An error occurred",
                        },
                        status: {
                            type: "number",
                            description: "HTTP status code",
                            example: 400,
                        },
                    },
                },
                ValidationError: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Validation failed",
                        },
                        errors: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    field: {
                                        type: "string",
                                        example: "email",
                                    },
                                    message: {
                                        type: "string",
                                        example: "Invalid email format",
                                    },
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                UnauthorizedError: {
                    description: "Access token is missing or invalid",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Error",
                            },
                            example: {
                                message: "Unauthorized: Invalid or missing token",
                                status: 401,
                            },
                        },
                    },
                },
                NotFoundError: {
                    description: "The specified resource was not found",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Error",
                            },
                            example: {
                                message: "Resource not found",
                                status: 404,
                            },
                        },
                    },
                },
                ValidationError: {
                    description: "Validation error",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ValidationError",
                            },
                        },
                    },
                },
                ServerError: {
                    description: "Internal server error",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Error",
                            },
                            example: {
                                message: "Internal server error",
                                status: 500,
                            },
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        "./src/routes/*.ts",
        "./src/controllers/*.ts",
        "./dist/src/routes/*.js",
        "./dist/src/controllers/*.js",
    ],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };