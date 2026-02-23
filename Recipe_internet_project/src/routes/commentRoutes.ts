import express from "express";
const router = express.Router({ mergeParams: true });
import commentController from "../controllers/commentController";
import authMiddleware from "../middleware/authMiddleware";

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
router.get("/recipe/:recipeId", commentController.getByRecipe.bind(commentController));

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
router.get("/", commentController.get.bind(commentController));

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
router.post("/", authMiddleware, commentController.post.bind(commentController));

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
router.delete("/:id", authMiddleware, commentController.del.bind(commentController));
router.put("/:id", authMiddleware, commentController.put.bind(commentController));

export default router;