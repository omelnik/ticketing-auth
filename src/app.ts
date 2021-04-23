import "express-async-errors";
import { errorHandler } from "./middleware/error-handler";
import { json } from "body-parser";
import { NotFoundError } from "./errors/not-found-error";
import cookieSession from "cookie-session";
import express from "express";
import router from "./routes/index";

const app = express();

app.use(json());
app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    // change specifically for the test environment
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use("/", router);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
