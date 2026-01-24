"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recipeModel_1 = __importDefault(require("../model/recipeModel"));
const baseController_1 = __importDefault(require("./baseController"));
//const recipeController = new baseController(Recipe);
class RecipeController extends baseController_1.default {
    constructor() {
        super(recipeModel_1.default);
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = req.query;
            try {
                const query = Object.keys(filter).length > 0 ? this.model.find(filter) : this.model.find();
                const data = yield query.populate('user', '_id email');
                res.json(data);
            }
            catch (error) {
                console.error('Error fetching recipes:', error);
                res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const data = yield this.model.findById(id).populate('user', '_id email');
                if (!data) {
                    return res.status(404).json({ error: "Recipe not found" });
                }
                res.json(data);
            }
            catch (error) {
                res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
            }
        });
    }
    post(req, res) {
        const _super = Object.create(null, {
            post: { get: () => super.post }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            req.body.user = userId; // שינינו מ-createdBy ל-user בהתאם למודל החדש
            return _super.post.call(this, req, res);
        });
    }
    put(req, res) {
        const _super = Object.create(null, {
            put: { get: () => super.put }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const recipe = yield recipeModel_1.default.findById(req.params.id);
            if (!recipe) {
                res.status(404).json({ error: "Recipe not found" });
                return;
            }
            if (recipe.user.toString() !== userId.toString()) {
                res.status(403).json({ error: "Forbidden" });
                return;
            }
            return _super.put.call(this, req, res);
        });
    }
    del(req, res) {
        const _super = Object.create(null, {
            del: { get: () => super.del }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            console.log('Delete request - User ID from token:', userId, 'Type:', typeof userId);
            const recipe = yield recipeModel_1.default.findById(req.params.id);
            if (!recipe) {
                res.status(404).json({ error: "Recipe not found" });
                return;
            }
            console.log('Recipe user ID:', recipe.user, 'Type:', typeof recipe.user);
            console.log('Recipe user ID toString:', recipe.user.toString());
            console.log('User ID toString:', userId === null || userId === void 0 ? void 0 : userId.toString());
            console.log('Are they equal?', recipe.user.toString() === (userId === null || userId === void 0 ? void 0 : userId.toString()));
            if (!userId || recipe.user.toString() !== userId.toString()) {
                res.status(403).json({ error: "Forbidden - You can only delete your own recipes" });
                return;
            }
            return _super.del.call(this, req, res);
        });
    }
}
exports.default = new RecipeController();
//# sourceMappingURL=recipeController.js.map