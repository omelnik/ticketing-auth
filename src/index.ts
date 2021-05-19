import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT || 3000;

(async () => {
  console.log("TEST");

  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
})();
