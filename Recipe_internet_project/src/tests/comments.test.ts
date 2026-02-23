import request from "supertest";
import intApp from "../index";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../model/userModel";
import Recipe from "../model/recipeModel";
import Comment from "../model/commentModel";

let app: Express;
let token: string;
let recipeId: string;
let commentId: string;

beforeAll(async () => {
    app = await intApp();
    await User.deleteMany();
    await Recipe.deleteMany();
    await Comment.deleteMany();

    const userRes = await request(app).post("/auth/register").send({
        email: "commenter@test.com", password: "pass", username: "Commenter"
    });
    token = userRes.body.token;

    const recipeRes = await request(app)
        .post("/recipes")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Cake", ingredients: ["Flour"], steps: ["Bake"], cookingTime: 60, imageCover: "img"
        });
    recipeId = recipeRes.body._id;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Comments API", () => {
    it("should create a new comment", async () => {
        const res = await request(app)
            .post("/comments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                comment: "This cake looks amazing!",
                recipe: recipeId
            });
        expect(res.status).toBe(201);
        expect(res.body.comment).toBe("This cake looks amazing!");
        commentId = res.body._id;
    });

    it("should get comments for a specific recipe", async () => {
        const res = await request(app).get(`/comments/recipe/${recipeId}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].comment).toBe("This cake looks amazing!");
    });

    it("should update a comment", async () => {
        const res = await request(app)
            .put(`/comments/${commentId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ comment: "Updated comment text" });
        expect(res.status).toBe(200);
        expect(res.body.comment).toBe("Updated comment text");
    });

    it("should fail to delete a comment without token", async () => {
        const res = await request(app).delete(`/comments/${commentId}`);
        expect(res.status).toBe(401);
    });

    it("should delete a comment", async () => {
        const res = await request(app)
            .delete(`/comments/${commentId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
    });
});