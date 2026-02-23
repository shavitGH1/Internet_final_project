import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "TasteBuds API",
            version: "1.0.0",
            description: "A REST API for managing recipes, comments, and users with authentication.",
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
                        _id: { type: "string", description: "User ID" },
                        email: { type: "string", description: "User email" },
                        username: { type: "string", description: "Username" },
                        profilePic: { type: "string", description: "URL to the user's profile picture" },
                    },
                },
                Recipe: {
                    type: "object",
                    required: ["title", "ingredients", "steps", "cookingTime", "imageCover"],
                    properties: {
                        _id: { type: "string", description: "Recipe ID" },
                        title: { type: "string", description: "Recipe title" },
                        description: { type: "string", description: "Recipe description" },
                        ingredients: { type: "array", items: { type: "string" }, description: "List of ingredients" },
                        steps: { type: "array", items: { type: "string" }, description: "Preparation steps" },
                        cookingTime: { type: "number", description: "Cooking time in minutes" },
                        imageCover: { type: "string", description: "URL to the recipe cover image" },
                        user: { type: "string", description: "ID of the user who created the recipe" },
                        favorites: { type: "array", items: { type: "string" }, description: "Array of user IDs who liked this recipe" },
                        commentCount: { type: "number", description: "Number of comments" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Comment: {
                    type: "object",
                    required: ["comment", "recipe"],
                    properties: {
                        _id: { type: "string", description: "Comment ID" },
                        comment: { type: "string", description: "The content of the comment" },
                        user: { type: "string", description: "ID of the user who wrote the comment" },
                        recipe: { type: "string", description: "ID of the recipe" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        status: { type: "number" },
                    },
                },
            },
            responses: {
                UnauthorizedError: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
                NotFoundError: { description: "Resource not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
                ServerError: { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./dist/src/routes/*.js", "./dist/src/controllers/*.js", "./src/index.ts"],
};

const specs = swaggerJsdoc(options);
export { specs, swaggerUi };