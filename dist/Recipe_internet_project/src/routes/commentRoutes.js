"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router({ mergeParams: true });
const commentController_1 = __importDefault(require("../controllers/commentController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
/**
 * @swagger
 * /comments/recipe/{recipeId}:
 * get:
 * summary: Get comments by recipe ID
 * description: Retrieve all comments associated with a specific recipe
 * tags: [Comments]
 * security: []
 * parameters:
 * - in: path
 * name: recipeId
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: List of comments for the recipe
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Comment'
 */
router.get("/recipe/:recipeId", commentController_1.default.getByRecipe.bind(commentController_1.default));
/**
 * @swagger
 * /comments:
 * get:
 * summary: Get all comments
 * description: Retrieve all comments in the system
 * tags: [Comments]
 * security: []
 * responses:
 * 200:
 * description: List of all comments
 */
router.get("/", commentController_1.default.get.bind(commentController_1.default));
/**
 * @swagger
 * /comments:
 * post:
 * summary: Create a new comment
 * description: Add a new comment to a recipe
 * tags: [Comments]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - comment
 * - recipe
 * properties:
 * comment:
 * type: string
 * recipe:
 * type: string
 * responses:
 * 201:
 * description: Comment created successfully
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/", authMiddleware_1.default, commentController_1.default.post.bind(commentController_1.default));
/**
 * @swagger
 * /comments/{id}:
 * put:
 * summary: Update a comment
 * description: Modify an existing comment by ID
 * tags: [Comments]
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
 * type: object
 * properties:
 * comment:
 * type: string
 * responses:
 * 200:
 * description: Comment updated
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 * delete:
 * summary: Delete a comment
 * description: Remove a comment by ID
 * tags: [Comments]
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
 * description: Comment deleted successfully
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 */
router.delete("/:id", authMiddleware_1.default, commentController_1.default.del.bind(commentController_1.default));
router.put("/:id", authMiddleware_1.default, commentController_1.default.put.bind(commentController_1.default));
exports.default = router;
//# sourceMappingURL=commentRoutes.js.map