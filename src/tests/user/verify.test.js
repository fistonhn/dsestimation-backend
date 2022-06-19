import request from "supertest";
import { Users } from "../../database/models";

import { signupUser, validUserSignup } from "./../mockdata/user";
import { generateTokenVerify } from "../../helpers/jwt_helper";
import app from "../../app";

describe("VERIFY user", () => {
  afterAll(async () => {
    await Users.destroy({ where: {} });
  });

  // write verify and save user to database
  it("should return 400 if user already exist", async () => {
    await Users.create(validUserSignup);
    const token = generateTokenVerify(validUserSignup);
    const response = await request(app)
      .get("/api/user/verify/signup")
      .query({ token });
    expect(response.status).toBe(400);
  });
  it("should return redirect user to the frontend url", async () => {
    const token = generateTokenVerify(signupUser);
    const response = await request(app)
      .get("/api/user/verify/signup")
      .query({ token });
    expect(response.status).toBe(302);
  });
});
