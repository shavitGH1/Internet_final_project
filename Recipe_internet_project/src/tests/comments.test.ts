import request from "supertest";
import intApp from "../index";
import Comments from "../model/commentModel";
import Recipe from "../model/recipeModel";
import { Express } from "express";
import { registerTestUser, userData, commentsData, recipeData } from "./testUtils";

let app: Express;
beforeAll(async () => {
  app = await intApp();
  await Comments.deleteMany({});
  await Recipe.deleteMany({});
  await registerTestUser(app);

  // create a recipe to comment on
  const recipeRes = await request(app)
    .post("/recipes")
    .set("Authorization", "Bearer " + userData.token)
    .send(recipeData[0]);

  // attach recipe id to all comment fixtures
  commentsData.forEach((comment) => {
    comment.recipe = recipeRes.body._id;
  });
});

afterAll((done) => {
  done();
});

describe("Comments API", () => {
  test("test get all empty db", async () => {
    console.log("Test is running");
    const response = await request(app).get("/comment");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("test post comment", async () => {
    //add all comments from commentsData
    for (const comment of commentsData) {
      const response = await request(app).post("/comment")
        .set("Authorization", "Bearer " + userData.token)
        .send(comment);
      if (response.statusCode !== 201) {
        console.log("comment create response", response.body);
      }
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("_id");
      comment._id = response.body._id;
    }
  });

  test("test get comments after post", async () => {
    const response = await request(app).get("/comment");
    if (response.statusCode !== 200) {
      console.log("get comments response", response.body);
    }
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(commentsData.length);
  });

  test("test get comments with filter", async () => {
    const recipeId = commentsData[0].recipe as string;
    const response = await request(app).get(
      "/comment?recipe=" + recipeId
    );
    if (response.statusCode !== 200) {
      console.log("get comments filtered response", response.body);
    }
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(commentsData.length);
    // persist ids from filtered fetch
    response.body.forEach((item: any, idx: number) => {
      commentsData[idx]._id = item._id;
    });
  });

  test("test get comment by id", async () => {
    const response = await request(app).get("/comment/" + commentsData[4]._id);
    if (response.statusCode !== 200) {
      console.log("get comment by id response", response.body);
    }
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(commentsData[4]._id);
  });

  test("test put comment by id", async () => {
    commentsData[4].comment = "this is the new text";
    const response = await request(app)
      .put("/comment/" + commentsData[4]._id)
      .set("Authorization", "Bearer " + userData.token)
      .send(commentsData[4]);
    if (response.statusCode !== 200) {
      console.log("put comment response", response.body);
    }
    expect(response.statusCode).toBe(200);
    expect(response.body.comment).toBe(commentsData[4].comment);
  });

  test("test delete comment by id", async () => {
    const response = await request(app).delete("/comment/" + commentsData[4]._id)
      .set("Authorization", "Bearer " + userData.token);
    if (response.statusCode !== 200) {
      console.log("delete comment response", response.body);
    }
    expect(response.statusCode).toBe(200);

    const getResponse = await request(app).get("/comment/" + commentsData[4]._id);
    expect(getResponse.statusCode).toBe(404);
  });
});
