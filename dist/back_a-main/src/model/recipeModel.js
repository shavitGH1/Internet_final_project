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
    difficulty: {
        type: String,
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
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