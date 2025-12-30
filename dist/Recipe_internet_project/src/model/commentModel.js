"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose")); // הוספנו כאן את Query
const commentSchema = new mongoose_1.default.Schema({
    // ... (שאר הסכימה נשארת ללא שינוי)
    comment: {
        type: String,
        required: [true, 'Comment can not be empty!']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Comment must belong to a user!']
    },
    recipe: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: [true, 'Comment must belong to a recipe!']
    }
});
commentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});
const Comment = mongoose_1.default.model('Comment', commentSchema);
exports.default = Comment;
//# sourceMappingURL=commentModel.js.map