import { StatusCodes } from "http-status-codes";
import app from "../../app";
import request from "supertest";
import { testUser, signUpEndpoint } from "../../test/setup";

describe("POST /api/users/signup", () => {
  it("returns a 201 on successful signup", async () => {
    return request(app)
      .post(signUpEndpoint)
      .send(testUser)
      .expect(StatusCodes.CREATED);
  });

  it("returns a 400 with an invalid email", async () => {
    return request(app)
      .post(signUpEndpoint)
      .send({
        email: "test#test.com",
        password: testUser.password,
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("returns a 400 with an invalid password", async () => {
    return request(app)
      .post(signUpEndpoint)
      .send({
        email: testUser.email,
        password: "p",
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("returns a 400 with missing email and password", async () => {
    await request(app)
      .post(signUpEndpoint)
      .send({ email: testUser.email })
      .expect(StatusCodes.BAD_REQUEST);

    await request(app)
      .post(signUpEndpoint)
      .send({ password: testUser.password })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("disallows duplicate emails", async () => {
    await request(app)
      .post(signUpEndpoint)
      .send(testUser)
      .expect(StatusCodes.CREATED);

    await request(app)
      .post(signUpEndpoint)
      .send(testUser)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("sets a cookie after successful signup", async () => {
    const response = await request(app)
      .post(signUpEndpoint)
      .send(testUser)
      .expect(StatusCodes.CREATED);
    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
