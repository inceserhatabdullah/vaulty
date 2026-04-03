import { Schema, model, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends Document {
  _id: string;
  username: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    _id: { type: String, default: () => uuidv4() },
    username: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{6,})/.test(value);
        },
        message:
          "Password must be at least 6 characters long and contain at least one letter, one number, and one special character.",
      },
    },
  },
  {
    timestamps: true,
    toObject: {
      transform: (doc, ret) => {
        const { password, __v, ...rest } = ret;
        return rest;
      },
    },
  },
);

userSchema.pre("save", async function (this: HydratedDocument<IUser>) {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const User = model<IUser>("User", userSchema);
