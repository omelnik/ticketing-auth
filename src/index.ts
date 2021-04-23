import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT || 3000;

(async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");

  await mongoose.connect("mongodb://auth-mongo-clusterip-srv:27017/auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
})();
