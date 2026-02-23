import request from "supertest";
import intApp from "../index";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../model/userModel";

let app: Express;
let token: string;

beforeAll(async () => {
    app = await intApp();
    await User.deleteMany();

    // יוצרים משתמש כדי לקבל טוקן לבדיקה
    const res = await request(app).post("/auth/register").send({
        email: "user@profile.com",
        password: "password123",
        username: "OldUsername"
    });
    token = res.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("User Profile API", () => {
    it("should update user profile successfully", async () => {
        const res = await request(app)
            .put("/user/update-profile")
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: "NewUsername",
                profilePic: "http://newpic.com/img.png"
            });

        expect(res.status).toBe(200);
        expect(res.body.username).toBe("NewUsername");
        expect(res.body.profilePic).toBe("http://newpic.com/img.png");
    });

    it("should fail to update profile without token", async () => {
        const res = await request(app)
            .put("/user/update-profile")
            .send({
                username: "Hacker"
            });

        expect(res.status).toBe(401);
    });
});