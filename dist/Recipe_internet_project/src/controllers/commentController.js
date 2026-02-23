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
const commentModel_1 = __importDefault(require("../model/commentModel"));
const baseController_1 = __importDefault(require("./baseController"));
class CommentController extends baseController_1.default {
    constructor() {
        super(commentModel_1.default);
    }
    post(req, res) {
        const _super = Object.create(null, {
            post: { get: () => super.post }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const authReq = req;
            if (!authReq.body.recipe)
                authReq.body.recipe = authReq.params.recipeId;
            if (!authReq.body.user)
                authReq.body.user = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id;
            return _super.post.call(this, authReq, res);
        });
    }
    getByRecipe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { recipeId } = req.params;
                const comments = yield this.model.find({ recipe: recipeId })
                    .sort({ createdAt: -1 });
                res.json(comments);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to fetch comments" });
            }
        });
    }
    del(req, res) {
        const _super = Object.create(null, {
            del: { get: () => super.del }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const authReq = req;
                const commentId = authReq.params.id;
                const comment = yield this.model.findById(commentId);
                if (!comment) {
                    res.status(404).json({ error: "Comment not found" });
                    return;
                }
                // חילוץ סופר-בטוח של ה-ID (פותר את התנגשות ה-Populate)
                let commentOwnerId = "";
                if (comment.user && typeof comment.user === 'object' && '_id' in comment.user) {
                    commentOwnerId = String(comment.user._id);
                }
                else if (comment.user) {
                    commentOwnerId = String(comment.user);
                }
                const currentUserId = String((_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id);
                // בדיקת הרשאות מוחלטת
                if (commentOwnerId !== currentUserId) {
                    console.log(`❌ 403 Forbidden | Comment Owner: ${commentOwnerId} | Current User: ${currentUserId}`);
                    res.status(403).json({ error: "Forbidden - You can only delete your own comments" });
                    return;
                }
                console.log(`✅ Authorization passed! Deleting comment ${commentId}`);
                yield _super.del.call(this, req, res);
            }
            catch (error) {
                console.error("Delete Error:", error);
                res.status(500).json({ error: "Server error during deletion" });
            }
        });
    }
}
exports.default = new CommentController();
//# sourceMappingURL=commentController.js.map