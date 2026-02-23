"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    comment: { type: String, required: true },
    recipe: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
commentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'username email profilePic'
    });
    next();
});
const Comment = mongoose_1.default.model('Comment', commentSchema);
exports.default = Comment;
//# sourceMappingURL=commentModel.js.map