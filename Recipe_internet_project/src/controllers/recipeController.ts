import Recipe from "../model/recipeModel";
import { Request, Response } from "express";
import baseController from "./baseController";
import { AuthRequest } from "../middleware/authMiddleware";

//const recipeController = new baseController(Recipe);

class RecipeController extends baseController {
    constructor() {
        super(Recipe);
    }

    async get(req: Request, res: Response) {
        const filter = req.query;
        try {
            const query = Object.keys(filter).length > 0 ? this.model.find(filter) : this.model.find();
            const data = await query.populate('user', '_id email');
            res.json(data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    }

    async getById(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const data = await this.model.findById(id).populate('user', '_id email');
            if (!data) {
                return res.status(404).json({ error: "Recipe not found" });
            }
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    }

    async post(req: AuthRequest, res: Response) {
        const userId = (req as any).user?._id;
        req.body.user = userId; // שינינו מ-createdBy ל-user בהתאם למודל החדש
        return super.post(req, res);
    }

    async put(req: Request, res: Response) {
        const authReq = req as AuthRequest;
        const userId = (authReq as any).user?._id;
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            res.status(404).json({ error: "Recipe not found" });
            return;
        }
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if (!recipe.user || String(recipe.user) !== String(userId)) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }
        await super.put(req, res);
        return;
    }

    async del(req: Request, res: Response) {
        const authReq = req as AuthRequest;
        const userId = (authReq as any).user?._id;
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            res.status(404).json({ error: "Recipe not found" });
            return;
        }
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if (!recipe.user || String(recipe.user) !== String(userId)) {
            res.status(403).json({ error: "Forbidden - You can only delete your own recipes" });
            return;
        }
        await super.del(req, res);
        return;
    }
}

export default new RecipeController();
