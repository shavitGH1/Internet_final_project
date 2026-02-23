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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../model/userModel"));
const recipeModel_1 = __importDefault(require("../model/recipeModel"));
const commentModel_1 = __importDefault(require("../model/commentModel"));
let app;
let token;
let recipeId;
let commentId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, index_1.default)();
    yield userModel_1.default.deleteMany();
    yield recipeModel_1.default.deleteMany();
    yield commentModel_1.default.deleteMany();
    const userRes = yield (0, supertest_1.default)(app).post("/auth/register").send({
        email: "commenter@test.com", password: "pass", username: "Commenter"
    });
    token = userRes.body.token;
    const recipeRes = yield (0, supertest_1.default)(app)
        .post("/recipes")
        .set("Authorization", `Bearer ${token}`)
        .send({
        title: "Cake", ingredients: ["Flour"], steps: ["Bake"], cookingTime: 60, imageCover: "img"
    });
    recipeId = recipeRes.body._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Comments API", () => {
    it("should create a new comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/comments")
            .set("Authorization", `Bearer ${token}`)
            .send({
            comment: "This cake looks amazing!",
            recipe: recipeId
        });
        expect(res.status).toBe(201);
        expect(res.body.comment).toBe("This cake looks amazing!");
        commentId = res.body._id;
    }));
    it("should get comments for a specific recipe", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get(`/comments/recipe/${recipeId}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].comment).toBe("This cake looks amazing!");
    }));
    it("should update a comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put(`/comments/${commentId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ comment: "Updated comment text" });
        expect(res.status).toBe(200);
        expect(res.body.comment).toBe("Updated comment text");
    }));
    it("should fail to delete a comment without token", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete(`/comments/${commentId}`);
        expect(res.status).toBe(401);
    }));
    it("should delete a comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete(`/comments/${commentId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
    }));
});
//# sourceMappingURL=comments.test.js.map