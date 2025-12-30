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
    // Override the post method to link the comment to the specific recipe and user
    post(req, res) {
        const _super = Object.create(null, {
            post: { get: () => super.post }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Allow nested routes: if recipeId is in params, use it
            if (!req.body.recipe)
                req.body.recipe = req.params.recipeId;
            if (!req.body.user)
                req.body.user = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            return _super.post.call(this, req, res);
        });
    }
}
exports.default = new CommentController();
//# sourceMappingURL=commentController.js.map