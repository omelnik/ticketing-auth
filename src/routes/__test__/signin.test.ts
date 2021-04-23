import { StatusCodes } from "http-status-codes";
import app from "../../app";
import request from "supertest";
import { testUser, signUpEndpoint, signInEndpoint } from "../../test/setup";

describe("POST /api/users/signin", () => {
  it("returns a 400 when an email that does not exist is supplied", async () => {
    return request(app)
      .post(signInEndpoint)
      .send(testUser)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("returns a 400 when an incorrect password is supplied", async () => {
    await request(app)
      .post(signUpEndpoint)
      .send(testUser)
      .expect(StatusCodes.CREATED);

    await request(app)
      .post(signInEndpoint)
      .send({
        email: testUser.email,
        password: "some-random-password",
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("returns a 200 with a cookie when the valid password is supplied", async () => {
    await request(app)
      .post(signUpEndpoint)
      .send(testUser)
      .expect(StatusCodes.CREATED);

    const response = await request(app)
      .post(signInEndpoint)
      .send(testUser)
      .expect(StatusCodes.OK);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
