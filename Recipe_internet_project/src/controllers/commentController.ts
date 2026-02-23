import Comment from "../model/commentModel";
import { Request, Response } from "express";
import BaseController from "./baseController";
import { AuthRequest } from "../middleware/authMiddleware";

class CommentController extends BaseController {
    constructor() {
        super(Comment);
    }

    async post(req: Request, res: Response) {
        const authReq = req as AuthRequest;
        if (!authReq.body.recipe) authReq.body.recipe = authReq.params.recipeId;
        if (!authReq.body.user) authReq.body.user = authReq.user?._id;
        return super.post(authReq, res);
    }

    async getByRecipe(req: Request, res: Response) {
        try {
            const { recipeId } = req.params;
            const comments = await this.model.find({ recipe: recipeId })
                .sort({ createdAt: -1 }); 
            res.json(comments);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch comments" });
        }
    }

    async del(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthRequest;
            const commentId = authReq.params.id;
            
            const comment = await this.model.findById(commentId);
            
            if (!comment) {
                res.status(404).json({ error: "Comment not found" });
                return;
            }

            // חילוץ סופר-בטוח של ה-ID (פותר את התנגשות ה-Populate)
            let commentOwnerId = "";
            if (comment.user && typeof comment.user === 'object' && '_id' in comment.user) {
                commentOwnerId = String((comment.user as any)._id);
            } else if (comment.user) {
                commentOwnerId = String(comment.user);
            }

            const currentUserId = String(authReq.user?._id);

            // בדיקת הרשאות מוחלטת
            if (commentOwnerId !== currentUserId) {
                console.log(`❌ 403 Forbidden | Comment Owner: ${commentOwnerId} | Current User: ${currentUserId}`);
                res.status(403).json({ error: "Forbidden - You can only delete your own comments" });
                return;
            }

            console.log(`✅ Authorization passed! Deleting comment ${commentId}`);
            await super.del(req, res);
        } catch (error) {
            console.error("Delete Error:", error);
            res.status(500).json({ error: "Server error during deletion" });
        }
    }
}

export default new CommentController();