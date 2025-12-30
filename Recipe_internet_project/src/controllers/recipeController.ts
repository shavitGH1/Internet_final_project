import Recipe from "../model/recipeModel";
import { Request, Response } from "express";
import baseController from "./baseController";
import { AuthRequest } from "../middleware/authMiddleware";

//const recipeController = new baseController(Recipe);

class RecipeController extends baseController {
    constructor() {
        super(Recipe);
    }
    async post(req: AuthRequest, res: Response) {
        const userId = (req as any).user?._id;
        req.body.user = userId; // שינינו מ-createdBy ל-user בהתאם למודל החדש
        return super.post(req, res);
    }

    async put(req: AuthRequest, res: Response) {
        const userId = (req as any).user?._id;
        const recipe = await Recipe.findById(req.params.id);
        if (recipe?.user.toString() !== userId) { // שינינו מ-createdBy ל-user
            res.status(403).json({ error: "Forbidden" });
            return;
        }
        return super.put(req, res);
    }

    async del(req: AuthRequest, res: Response) {
        const userId = (req as any).user?._id;
        const recipe = await Recipe.findById(req.params.id);
        if (recipe?.user.toString() !== userId) { // שינינו מ-createdBy ל-user
            res.status(403).json({ error: "Forbidden" });
            return;
        }
        return super.del(req, res);
    }
}

export default new RecipeController();
