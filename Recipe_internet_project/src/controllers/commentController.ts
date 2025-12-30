import Comment from "../model/commentModel";
import { Request, Response } from "express";
import baseController from "./baseController";
import { AuthRequest } from "../middleware/authMiddleware";

class CommentController extends baseController {
    constructor() {
        super(Comment);
    }

    // Override the post method to link the comment to the specific recipe and user
    async post(req: AuthRequest, res: Response) {
        // Allow nested routes: if recipeId is in params, use it
        if (!req.body.recipe) req.body.recipe = req.params.recipeId;
        if (!req.body.user) req.body.user = (req as any).user?._id;
        
        return super.post(req, res);
    }
}

export default new CommentController();
