import request from "supertest";
import intApp from "../index";
import { Express } from "express";
import User from "../model/userModel";
import Recipe from "../model/recipeModel";
import { userData, singleRecipeData, recipeData } from "./testUtils";

let app: Express;
beforeAll(async () => {
    app = await intApp();
    await User.deleteMany({});
    await Recipe.deleteMany({});
});

afterAll((done) => {
    done();
});

describe("Auth API", () => {
    test("access restricted url denied", async () => {
        const response = await request(app).post("/recipes").send(singleRecipeData);
        expect(response.statusCode).toBe(401);
    });

    test("test register", async () => {
        const response = await request(app).post("/auth/register").send({
            email: userData.email,
            password: userData.password
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refreshToken");
        userData._id = response.body._id;
        userData.token = response.body.token;
        userData.refreshToken = response.body.refreshToken;
    });

    test("test access with token permitted1", async () => {
        const response = await request(app).post("/recipes")
            .set("Authorization", "Bearer " + userData.token)
            .send(singleRecipeData);
        if (response.statusCode !== 201) {
            console.log("recipe create response", response.body);
        }
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("_id");
    });

    test("test access with modified token restricted", async () => {
        const newToken = userData.token + "m";
        const response = await request(app).post("/recipes")
            .set("Authorization", "Bearer " + newToken)
            .send(singleRecipeData);
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty("error");
    });

    test("test login", async () => {
        const response = await request(app).post("/auth/login").send({
            email: userData.email,
            password: userData.password
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refreshToken");
        userData.token = response.body.token;
        userData.refreshToken = response.body.refreshToken;
    });

    test("test access with token permitted2", async () => {
        const response = await request(app).post("/recipes")
            .set("Authorization", "Bearer " + userData.token)
            .send(recipeData[1]);
        if (response.statusCode !== 201) {
            console.log("recipe create response #2", response.body);
        }
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("_id");
        recipeData[1]._id = response.body._id;
    });

    //test double use of refresh token
    test("test double use of refresh token", async () => {
        //get new token using refresh token
        const refreshResponse1 = await request(app).post("/auth/refresh-token").send({
            refreshToken: userData.refreshToken
        });
        expect(refreshResponse1.statusCode).toBe(200);
        expect(refreshResponse1.body).toHaveProperty("token");
        expect(refreshResponse1.body).toHaveProperty("refreshToken");
        const firstNewRefreshToken = refreshResponse1.body.refreshToken;

        //try to use the same refresh token again
        const refreshResponse2 = await request(app).post("/auth/refresh-token").send({
            refreshToken: userData.refreshToken
        });
        expect(refreshResponse2.statusCode).toBe(401);
        expect(refreshResponse2.body).toHaveProperty("error");

        //try to use the new refresh token to see that it is bnlocked
        const refreshResponse3 = await request(app).post("/auth/refresh-token").send({
            refreshToken: firstNewRefreshToken
        });
        expect(refreshResponse3.statusCode).toBe(401);
        expect(refreshResponse3.body).toHaveProperty("error");
    });
});