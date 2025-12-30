"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recipeController_1 = __importDefault(require("./../controllers/recipeController"));
const authController_1 = __importDefault(require("./../controllers/authController"));
const commentRoutes_1 = __importDefault(require("./commentRoutes")); // ייבוא הראוטר של התגובות
const router = express_1.default.Router();
router.use('/:recipeId/comments', commentRoutes_1.default);
router.use(authController_1.default.protect);
router
    .route('/')
    .get(recipeController_1.default.get) // שונה מ-getAllRecipes
    .post(recipeController_1.default.post); // שונה מ-createRecipe
router
    .route('/:id')
    .get(recipeController_1.default.getById) // שונה מ-getRecipe
    .patch(recipeController_1.default.put) // שונה מ-updateRecipe
    .delete(authController_1.default.restrictTo('user', 'admin'), recipeController_1.default.del // שונה מ-deleteRecipe
);
exports.default = router;
//# sourceMappingURL=recipesRoutes.js.map