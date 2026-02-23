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
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, index_1.default)();
    yield userModel_1.default.deleteMany(); // מנקים את מסד הנתונים לפני הטסטים
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Auth API", () => {
    const testUser = {
        email: "test@auth.com",
        password: "password123",
        username: "AuthTester",
        profilePic: "http://example.com/pic.png"
    };
    let refreshToken;
    it("should register a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/register").send(testUser);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("token");
        expect(res.body).toHaveProperty("refreshToken");
        expect(res.body.username).toBe(testUser.username);
    }));
    it("should fail to register with an existing email", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/register").send(testUser);
        expect(res.status).toBe(400); // Validation error
    }));
    it("should login successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/login").send({
            email: testUser.email,
            password: testUser.password
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body).toHaveProperty("refreshToken");
        refreshToken = res.body.refreshToken;
    }));
    it("should fail to login with wrong password", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/login").send({
            email: testUser.email,
            password: "wrongpassword"
        });
        expect(res.status).toBe(401);
    }));
    it("should refresh token successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/refresh-token").send({
            refreshToken: refreshToken
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body).toHaveProperty("refreshToken");
    }));
});
//# sourceMappingURL=auth.test.js.map