import express from "express";
import { currentUserRouter } from "./current-user";
import { signinUserRouter } from "./signin";
import { signoutUserRouter } from "./signout";
import { signupUserRouter } from "./signup";

const router = express.Router();

router.use(
  "/api/users",
  currentUserRouter,
  signinUserRouter,
  signoutUserRouter,
  signupUserRouter
);

export default router;
