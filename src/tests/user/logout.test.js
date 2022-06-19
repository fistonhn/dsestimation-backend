import request from "supertest";
import { Users } from "../../database/models";

import { validUserSignup, validUserLogin } from "./../mockdata/user";
import app from "../../app";
import { redisClient } from "../../helpers";

describe("DELETE logout user", () => {
  afterAll(async () => {
    await Users.destroy({ where: {} });
    await redisClient.quit();
  });

  let token;
  let userId;

  it("should login before logout", async () => {
    const user = await Users.create(validUserSignup);
    userId = user.id;
    const response = await request(app)
      .post("/api/user/login")
      .send(validUserLogin);
    token = response.body.data.accessToken;
    expect(response.status).toBe(200);
  });

  it("should return a 200 response when user logout", async () => {
    const response = await request(app)
      .delete("/api/user/logout")
      .set("auth-token", token);
    await redisClient.del(`refreshToken-${userId}`);
    await redisClient.del(`accessToken-${userId}`);
    expect(response.status).toBe(200);
  });

  it("should return 401 if no token found", async () => {
    const response = await request(app).delete(`/api/user/logout`);
    expect(response.status).toBe(401);
  });
  it("should return 400 if user try to logout again", async () => {
    const response = await request(app)
      .delete(`/api/user/logout`)
      .set("auth-token", token);
    await redisClient.del(`refreshToken-${userId}`);
    await redisClient.del(`accessToken-${userId}`);
    expect(response.status).toBe(400);
  });
});
