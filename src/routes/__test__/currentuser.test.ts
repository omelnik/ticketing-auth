import { StatusCodes } from "http-status-codes";
import app from "../../app";
import request from "supertest";
import { testUser, currentUserEndpoint } from "../../test/setup";

describe("GET /api/users/currentuser", () => {
  it("responds with details about the current user", async () => {
    const cookie = await global.signup(testUser);

    const response = await request(app)
      .get(currentUserEndpoint)
      .set("Cookie", cookie)
      .send()
      .expect(StatusCodes.OK);

    const { email } = response.body.currentUser;
    expect(email).toEqual(testUser.email);
  });

  it("responds with null if not authenticated", async () => {
    const response = await request(app)
      .get(currentUserEndpoint)
      .send()
      .expect(StatusCodes.OK);

    const { currentUser } = response.body;
    expect(currentUser).toEqual(null);
  });
});
