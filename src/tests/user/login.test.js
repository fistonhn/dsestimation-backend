import request from "supertest";
import { Users } from "../../database/models";

import {
  loginWithNoPassword,
  validUserLogin,
  loginWithNoEmail,
  loginWithWrongPassword,
  loginWithWrongEmail,
  validUserSignup,
} from "../mockdata/user";
import app from "../../app";

// drop users table  after all tests
describe("LOGIN POST /api/user/login", () => {
  // drop users table  after all tests
  afterAll(async () => {
    await Users.destroy({ where: {} });
  });

  it("should return a 200 response when user login with valid credentials", async () => {
    // CREATE USER
    await Users.create(validUserSignup);
    const response = await request(app)
      .post("/api/user/login")
      .send(validUserLogin);
    expect(response.status).toBe(200);
    expect(response.body.data.accessToken).toBeTruthy();
  });
  it("should return 400 if not password in the form", async () => {
    const response = await request(app)
      .post("/api/user/login")
      .send(loginWithNoPassword);
    expect(response.status).toBe(400);
  });
  it("should return 400 if not email in the form", async () => {
    const response = await request(app)
      .post("/api/user/login")
      .send(loginWithNoEmail);
    expect(response.status).toBe(400);
  });

  it("should return 401 if password is wrong", async () => {
    const response = await request(app)
      .post("/api/user/login")
      .send(loginWithWrongPassword);
    expect(response.status).toBe(400);
  });

  it("should return 401 if email is wrong", async () => {
    const response = await request(app)
      .post("/api/user/login")
      .send(loginWithWrongEmail);
    expect(response.status).toBe(400);
  });
});
