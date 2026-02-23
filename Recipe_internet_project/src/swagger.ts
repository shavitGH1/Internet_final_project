import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const isDist = __dirname.includes(`${path.sep}dist${path.sep}`);

const apis = isDist
  ? [path.join(__dirname, "routes", "*.js"), path.join(__dirname, "controllers", "*.js")]
  : [
      path.join(process.cwd(), "Recipe_internet_project", "src", "routes", "*.ts"),
      path.join(process.cwd(), "Recipe_internet_project", "src", "controllers", "*.ts"),
    ];

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TasteBuds API",
      version: "1.0.0",
      description:
        "A REST API for managing recipes, comments, and users with authentication.",
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:3000",
        description: "Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
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
            profilePic: { type: "string", description: "URL to profile picture" },
          },
        },
        Recipe: {
          type: "object",
          required: ["title", "ingredients", "steps", "cookingTime", "imageCover"],
          properties: {
            _id: { type: "string", description: "Recipe ID" },
            title: { type: "string", description: "Recipe title" },
            description: { type: "string", description: "Recipe description" },
            ingredients: {
              type: "array",
              items: { type: "string" },
              description: "Ingredients list",
            },
            steps: {
              type: "array",
              items: { type: "string" },
              description: "Preparation steps",
            },
            cookingTime: { type: "number", description: "Minutes" },
            imageCover: { type: "string", description: "Cover image URL" },
            user: { type: "string", description: "Owner user ID" },
            favorites: {
              type: "array",
              items: { type: "string" },
              description: "User IDs who favorited",
            },
            commentCount: { type: "number", description: "Comments count" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Comment: {
          type: "object",
          required: ["comment", "recipe"],
          properties: {
            _id: { type: "string", description: "Comment ID" },
            comment: { type: "string", description: "Comment text" },
            user: { type: "string", description: "Author user ID" },
            recipe: { type: "string", description: "Recipe ID" },
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
        ValidationError: {
          description: "Validation error",
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Error" } },
          },
        },
        UnauthorizedError: {
          description: "Unauthorized",
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Error" } },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Error" } },
          },
        },
        ServerError: {
          description: "Internal server error",
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Error" } },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis,
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };