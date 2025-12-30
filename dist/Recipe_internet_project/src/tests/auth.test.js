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
const userModel_1 = __importDefault(require("../model/userModel"));
const recipeModel_1 = __importDefault(require("../model/recipeModel"));
const testUtils_1 = require("./testUtils");
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, index_1.default)();
    yield userModel_1.default.deleteMany({});
    yield recipeModel_1.default.deleteMany({});
}));
afterAll((done) => {
    done();
});
describe("Auth API", () => {
    test("access restricted url denied", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/recipes").send(testUtils_1.singleRecipeData);
        expect(response.statusCode).toBe(401);
    }));
    test("test register", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send({
            email: testUtils_1.userData.email,
            password: testUtils_1.userData.password
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refreshToken");
        testUtils_1.userData._id = response.body._id;
        testUtils_1.userData.token = response.body.token;
        testUtils_1.userData.refreshToken = response.body.refreshToken;
    }));
    test("test access with token permitted1", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/recipes")
            .set("Authorization", "Bearer " + testUtils_1.userData.token)
            .send(testUtils_1.singleRecipeData);
        if (response.statusCode !== 201) {
            console.log("recipe create response", response.body);
        }
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("_id");
    }));
    test("test access with modified token restricted", () => __awaiter(void 0, void 0, void 0, function* () {
        const newToken = testUtils_1.userData.token + "m";
        const response = yield (0, supertest_1.default)(app).post("/recipes")
            .set("Authorization", "Bearer " + newToken)
            .send(testUtils_1.singleRecipeData);
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty("error");
    }));
    test("test login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({
            email: testUtils_1.userData.email,
            password: testUtils_1.userData.password
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refreshToken");
        testUtils_1.userData.token = response.body.token;
        testUtils_1.userData.refreshToken = response.body.refreshToken;
    }));
    test("test access with token permitted2", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/recipes")
            .set("Authorization", "Bearer " + testUtils_1.userData.token)
            .send(testUtils_1.recipeData[1]);
        if (response.statusCode !== 201) {
            console.log("recipe create response #2", response.body);
        }
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("_id");
        testUtils_1.recipeData[1]._id = response.body._id;
    }));
    //test double use of refresh token
    test("test double use of refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        //get new token using refresh token
        const refreshResponse1 = yield (0, supertest_1.default)(app).post("/auth/refresh-token").send({
            refreshToken: testUtils_1.userData.refreshToken
        });
        expect(refreshResponse1.statusCode).toBe(200);
        expect(refreshResponse1.body).toHaveProperty("token");
        expect(refreshResponse1.body).toHaveProperty("refreshToken");
        const firstNewRefreshToken = refreshResponse1.body.refreshToken;
        //try to use the same refresh token again
        const refreshResponse2 = yield (0, supertest_1.default)(app).post("/auth/refresh-token").send({
            refreshToken: testUtils_1.userData.refreshToken
        });
        expect(refreshResponse2.statusCode).toBe(401);
        expect(refreshResponse2.body).toHaveProperty("error");
        //try to use the new refresh token to see that it is bnlocked
        const refreshResponse3 = yield (0, supertest_1.default)(app).post("/auth/refresh-token").send({
            refreshToken: firstNewRefreshToken
        });
        expect(refreshResponse3.statusCode).toBe(401);
        expect(refreshResponse3.body).toHaveProperty("error");
    }));
});
//# sourceMappingURL=auth.test.js.map