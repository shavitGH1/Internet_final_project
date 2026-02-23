import request from "supertest";
import intApp from "../index";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../model/userModel";

let app: Express;

beforeAll(async () => {
    app = await intApp();
    await User.deleteMany(); // מנקים את מסד הנתונים לפני הטסטים
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Auth API", () => {
    const testUser = {
        email: "test@auth.com",
        password: "password123",
        username: "AuthTester",
        profilePic: "http://example.com/pic.png"
    };

    let refreshToken: string;

    it("should register a new user", async () => {
        const res = await request(app).post("/auth/register").send(testUser);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("token");
        expect(res.body).toHaveProperty("refreshToken");
        expect(res.body.username).toBe(testUser.username);
    });

    it("should fail to register with an existing email", async () => {
        const res = await request(app).post("/auth/register").send(testUser);
        expect(res.status).toBe(400); // Validation error
    });

    it("should login successfully", async () => {
        const res = await request(app).post("/auth/login").send({
            email: testUser.email,
            password: testUser.password
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body).toHaveProperty("refreshToken");
        refreshToken = res.body.refreshToken;
    });

    it("should fail to login with wrong password", async () => {
        const res = await request(app).post("/auth/login").send({
            email: testUser.email,
            password: "wrongpassword"
        });
        expect(res.status).toBe(401);
    });

    it("should refresh token successfully", async () => {
        const res = await request(app).post("/auth/refresh-token").send({
            refreshToken: refreshToken
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body).toHaveProperty("refreshToken");
    });
});