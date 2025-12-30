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
exports.registerTestUser = exports.commentsData = exports.singleRecipeData = exports.recipeData = exports.userData = void 0;
const supertest_1 = __importDefault(require("supertest"));
const userModel_1 = __importDefault(require("../model/userModel"));
exports.userData = {
    email: "test@recipes.com",
    password: "testpasswordRecipes",
};
exports.recipeData = [
    {
        title: "Recipe A",
        ingredients: ["Ingredient 1", "Ingredient 2"],
        steps: ["Step 1", "Step 2"],
        cookingTime: 30,
        imageCover: "cover-a.jpg",
        difficulty: "easy",
    },
    {
        title: "Recipe B",
        ingredients: ["Ingredient 1", "Ingredient 2"],
        steps: ["Step 1", "Step 2"],
        cookingTime: 45,
        imageCover: "cover-b.jpg",
        difficulty: "medium",
    }
];
exports.singleRecipeData = Object.assign({}, exports.recipeData[0]);
exports.commentsData = [
    { comment: "Great recipe!" },
    { comment: "Loved it!" },
    { comment: "Not bad." },
    { comment: "Needs more salt." },
    { comment: "Could be better." },
];
const registerTestUser = (app) => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.default.deleteMany({ "email": exports.userData.email });
    const res = yield (0, supertest_1.default)(app).post("/auth/register").send({
        email: exports.userData.email,
        password: exports.userData.password
    });
    exports.userData._id = res.body._id;
    exports.userData.token = res.body.token;
});
exports.registerTestUser = registerTestUser;
//# sourceMappingURL=testUtils.js.map