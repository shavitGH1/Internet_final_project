import { Express } from "express";
import request from "supertest";
import User from "../model/userModel";

type UserData = {
    email: string;
    password: string;
    _id?: string;
    token?: string;
    refreshToken?: string;
};
export const userData: UserData = {
    email: "test@recipes.com",
    password: "testpasswordRecipes",

};

export type RecipeData = {
    title: string;
    ingredients: string[];
    steps: string[];
    cookingTime: number;
    imageCover: string;
    difficulty: "easy" | "medium" | "difficult";
    _id?: string;
};

export const recipeData: RecipeData[] = [
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

export const singleRecipeData: RecipeData = { ...recipeData[0] };

export type CommentsData = {
    comment: string;
    recipe?: string;
    writerId?: string;
    _id?: string;
};

export var commentsData: CommentsData[] = [
    { comment: "Great recipe!" },
    { comment: "Loved it!" },
    { comment: "Not bad." },
    { comment: "Needs more salt." },
    { comment: "Could be better." },
];

export const registerTestUser = async (app: Express) => {
    await User.deleteMany({ "email": userData.email });

    const res = await request(app).post("/auth/register").send({
        email: userData.email,
        password: userData.password
    });
    userData._id = res.body._id;
    userData.token = res.body.token;
}