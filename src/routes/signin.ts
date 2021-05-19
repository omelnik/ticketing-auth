import { BadRequestError } from "@git-tickets/common/errors";
import { validateRequest } from "@git-tickets/common/middleware";
import { body } from "express-validator";
import { Router, Request, Response } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import Password from "../services/password";

const router = Router();

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email must be valid."),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new BadRequestError("Invalid credentials.");

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordMatch) throw new BadRequestError("Invalid credentials.");
    // generate jwt
    // TODO: it can be moved into a reusable function
    const userJWT = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      // disable TS check
      process.env.JWT_KEY!
    );
    // store token on session object
    req.session = {
      jwt: userJWT,
    };
    res.status(200).send(existingUser);
  }
);

export { router as signinUserRouter };
