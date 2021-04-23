import { IUser } from "../models/user";
import { MongoMemoryServer } from "mongodb-memory-server";
import { StatusCodes } from "http-status-codes";
import app from "../app";
import mongoose from "mongoose";
import request from "supertest";

export const currentUserEndpoint: string = "/api/users/currentuser";
export const signUpEndpoint: string = "/api/users/signup";
export const signOutEndpoint: string = "/api/users/signout";
export const signInEndpoint: string = "/api/users/signin";

declare global {
  namespace NodeJS {
    interface Global {
      signup(user: IUser): Promise<string[]>;
    }
  }
}

let mongo: any;
beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  collections.forEach((collection) => collection.deleteMany({}));
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// Potentially could be moved to config.ts file under test dir
export const testUser = {
  email: "test@test.com",
  password: "password",
};

global.signup = async (user: IUser) => {
  const response = await request(app)
    .post("/api/users/signup")
    .send(user)
    .expect(StatusCodes.CREATED);

  const cookie = response.get("Set-Cookie");
  return cookie;
};
