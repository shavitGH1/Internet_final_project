import request from "supertest";
import intApp from "../index";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../model/userModel";
import Recipe from "../model/recipeModel";

let app: Express;
let token1: string; // טוקן של היוצר
let token2: string; // טוקן של משתמש אחר
let recipeId: string;

beforeAll(async () => {
    app = await intApp();
    await User.deleteMany();
    await Recipe.deleteMany();

    const res1 = await request(app).post("/auth/register").send({
        email: "chef1@test.com", password: "password", username: "Chef1"
    });
    token1 = res1.body.token;

    const res2 = await request(app).post("/auth/register").send({
        email: "chef2@test.com", password: "password", username: "Chef2"
    });
    token2 = res2.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Recipes API", () => {
    const testRecipe = {
        title: "Test Pasta",
        description: "Yummy pasta",
        ingredients: ["Pasta", "Tomato"],
        steps: ["Boil water", "Add pasta"],
        cookingTime: 15,
        imageCover: "pasta.png"
    };

    it("should create a new recipe", async () => {
        const res = await request(app)
            .post("/recipes")
            .set("Authorization", `Bearer ${token1}`)
            .send(testRecipe);
        expect(res.status).toBe(201);
        expect(res.body.title).toBe(testRecipe.title);
        recipeId = res.body._id;
    });

    it("should get all recipes with pagination", async () => {
        const res = await request(app).get("/recipes?page=1&limit=5");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });

    it("should get a recipe by ID", async () => {
        const res = await request(app).get(`/recipes/${recipeId}`);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe(testRecipe.title);
    });

    it("should toggle favorite status", async () => {
        const res = await request(app)
            .post(`/recipes/${recipeId}/favorite`)
            .set("Authorization", `Bearer ${token2}`);
        expect(res.status).toBe(200);
        expect(res.body.favorites.length).toBe(1); // משתמש 2 הוסיף למועדפים
    });

    it("should fail to update a recipe by a non-owner", async () => {
        const res = await request(app)
            .patch(`/recipes/${recipeId}`)
            .set("Authorization", `Bearer ${token2}`) // משתמש 2 מנסה לערוך
            .send({ title: "Hacked Title" });
        expect(res.status).toBe(403);
    });

    it("should update a recipe by the owner", async () => {
        const res = await request(app)
            .patch(`/recipes/${recipeId}`)
            .set("Authorization", `Bearer ${token1}`)
            .send({ cookingTime: 20 });
        expect(res.status).toBe(200);
        expect(res.body.cookingTime).toBe(20);
    });

    it("should fail to delete a recipe by a non-owner", async () => {
        const res = await request(app)
            .delete(`/recipes/${recipeId}`)
            .set("Authorization", `Bearer ${token2}`);
        expect(res.status).toBe(403);
    });

    it("should delete a recipe by the owner", async () => {
        const res = await request(app)
            .delete(`/recipes/${recipeId}`)
            .set("Authorization", `Bearer ${token1}`);
        expect(res.status).toBe(200);

        // נוודא שבאמת נמחק
        const check = await request(app).get(`/recipes/${recipeId}`);
        expect(check.status).toBe(404);
    });
});