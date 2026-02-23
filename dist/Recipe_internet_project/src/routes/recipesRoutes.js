"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recipeController_1 = __importDefault(require("../controllers/recipeController"));
const authController_1 = __importDefault(require("../controllers/authController"));
const router = express_1.default.Router();
/**
 * @swagger
 * /recipes:
 * get:
 * summary: Get all recipes
 * description: Retrieve a paginated list of recipes. Can be filtered by user.
 * tags: [Recipes]
 * security: []
 * parameters:
 * - in: query
 * name: page
 * schema:
 * type: integer
 * description: Page number for pagination
 * - in: query
 * name: limit
 * schema:
 * type: integer
 * description: Number of items per page
 * - in: query
 * name: user
 * schema:
 * type: string
 * description: Filter recipes by a specific user ID
 * responses:
 * 200:
 * description: A list of recipes
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Recipe'
 * 500:
 * $ref: '#/components/responses/ServerError'
 */
router.get('/', recipeController_1.default.get.bind(recipeController_1.default));
/**
 * @swagger
 * /recipes/{id}:
 * get:
 * summary: Get a recipe by ID
 * description: Retrieve a single recipe by its unique ID
 * tags: [Recipes]
 * security: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: Recipe ID
 * responses:
 * 200:
 * description: The requested recipe
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Recipe'
 * 404:
 * $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', recipeController_1.default.getById.bind(recipeController_1.default));
router.use(authController_1.default.protect);
/**
 * @swagger
 * /recipes/{id}/favorite:
 * post:
 * summary: Toggle favorite status
 * description: Add or remove a recipe from the authenticated user's favorites
 * tags: [Recipes]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Favorite toggled successfully
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 * 404:
 * $ref: '#/components/responses/NotFoundError'
 */
router.post('/:id/favorite', recipeController_1.default.toggleFavorite.bind(recipeController_1.default));
/**
 * @swagger
 * /recipes:
 * post:
 * summary: Create a new recipe
 * description: Create a new recipe associated with the authenticated user
 * tags: [Recipes]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Recipe'
 * responses:
 * 201:
 * description: Recipe created successfully
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/', recipeController_1.default.post.bind(recipeController_1.default));
/**
 * @swagger
 * /recipes/{id}:
 * patch:
 * summary: Update a recipe
 * description: Update an existing recipe by ID. Only the owner can update.
 * tags: [Recipes]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Recipe'
 * responses:
 * 200:
 * description: Recipe updated successfully
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 * 403:
 * description: Forbidden - Not the owner
 * 404:
 * $ref: '#/components/responses/NotFoundError'
 * delete:
 * summary: Delete a recipe
 * description: Delete a recipe by ID. Only the owner can delete.
 * tags: [Recipes]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Recipe deleted successfully
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 * 403:
 * description: Forbidden - Not the owner
 * 404:
 * $ref: '#/components/responses/NotFoundError'
 */
router
    .route('/:id')
    .patch(recipeController_1.default.put.bind(recipeController_1.default))
    .delete(recipeController_1.default.del.bind(recipeController_1.default));
exports.default = router;
//# sourceMappingURL=recipesRoutes.js.map