import request from "supertest";
import { redisClient } from "../../helpers";

import {
  signupUser,
  signupWithNoname,
  signupWithNoEmail,
  signupWithNoPassword,
} from "./../mockdata/user";
import app from "../../app";

describe("POST Register user", () => {
  afterAll(async () => {
    await redisClient.quit();
  });

  it("should return a 200 response when user signup with valid credentials", async () => {
    const response = await request(app)
      .post("/api/user/register")
      .send(signupUser);
    expect(response.status).toBe(200);
  });

  it("should return 400 if not name in the form", async () => {
    const response = await request(app)
      .post("/api/user/register")
      .send(signupWithNoname);
    expect(response.status).toBe(400);
  });

  it("should return 400 if not email in the form", async () => {
    const response = await request(app)
      .post("/api/user/register")
      .send(signupWithNoEmail);
    expect(response.status).toBe(400);
  });

  it("should return 400 if not password in the form", async () => {
    const response = await request(app)
      .post("/api/user/register")
      .send(signupWithNoPassword);
    expect(response.status).toBe(400);
  });
});
