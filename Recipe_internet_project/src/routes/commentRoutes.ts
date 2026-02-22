import express from "express";
const router = express.Router({ mergeParams: true });
import commentController from "../controllers/commentController";
import authMiddleware from "../middleware/authMiddleware";

// נתיבים פתוחים (ללא 403 בטעינה)
router.get("/recipe/:recipeId", commentController.getByRecipe.bind(commentController));
router.get("/", commentController.get.bind(commentController));

// נתיבים מוגנים (דורשים טוקן)
router.post("/", authMiddleware, commentController.post.bind(commentController));
router.delete("/:id", authMiddleware, commentController.del.bind(commentController));
router.put("/:id", authMiddleware, commentController.put.bind(commentController));

export default router;