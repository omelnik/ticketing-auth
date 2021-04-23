import { BadRequestError } from "../errors/bad-request-error";
import { body } from "express-validator";
import { Router, Request, Response } from "express";
import { User } from "../models/user";
import { validateRequest } from "../middleware/validate-request";
import jwt from "jsonwebtoken";

const router = Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email must be valid."),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const isExist = await User.findOne({ email });
    if (isExist) {
      throw new BadRequestError("Email already in use");
    }
    const user = User.build({ email, password });
    await user.save();
    // generate jwt
    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      // disable TS check
      process.env.JWT_KEY!
    );
    // store token on session object
    req.session = {
      jwt: userJWT,
    };
    res.status(201).send(user);
  }
);

export { router as signupUserRouter };
