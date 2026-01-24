"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const recipeSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, 'A recipe must have a title'],
        unique: true,
        trim: true,
        maxlength: [40, 'A recipe title must have less or equal than 40 characters']
    },
    description: {
        type: String,
        trim: true
    },
    ingredients: {
        type: [String],
        required: [true, 'A recipe must have ingredients']
    },
    steps: {
        type: [String],
        required: [true, 'A recipe must have steps']
    },
    cookingTime: {
        type: Number,
        required: [true, 'A recipe must have a cooking time']
    },
    imageCover: {
        type: String,
        required: [true, 'A recipe must have a cover image']
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Recipe must belong to a User']
    }
});
recipeSchema.index({ title: 1, difficulty: 1 });
const Recipe = mongoose_1.default.model('Recipe', recipeSchema);
exports.default = Recipe;
//# sourceMappingURL=recipeModel.js.map