import { StatusCodes } from "http-status-codes";
import app from "../../app";
import request from "supertest";
import { testUser, signUpEndpoint, signOutEndpoint } from "../../test/setup";

describe("POST /api/users/signout", () => {
  it("clears a cookie after signing out", async () => {
    const signUpResponse = await request(app)
      .post(signUpEndpoint)
      .send(testUser)
      .expect(StatusCodes.CREATED);
    expect(signUpResponse.get("Set-Cookie")).toBeDefined();

    const response = await request(app)
      .post(signOutEndpoint)
      .send({})
      .expect(StatusCodes.OK);
    expect(response.get("Set-Cookie")[0]).toEqual(
      "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
    );
  });
});
