import { model, Schema, Model, Document } from "mongoose";
import Password from "../services/password";

// Interface that describes the properties
// that are required to create a new User
export interface IUser {
  email: string;
  password: string;
}

// Interface that describes the properties
// that a User model has
interface IUserModel extends Model<IUserDoc> {
  build(attrs: IUser): IUserDoc;
}

// Interface that describes the properties
// that a User Document has
interface IUserDoc extends Document {
  email: string;
  password: string;
}

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    // Here's the example with the global mongoose config
    // @link: https://stackoverflow.com/a/61184741
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

UserSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

UserSchema.statics.build = (attrs: IUser) => new User(attrs);

export const User = model<IUserDoc, IUserModel>("User", UserSchema);
