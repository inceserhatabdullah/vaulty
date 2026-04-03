import { Schema, model, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";
import { IBaseEntity } from "../interfaces/base.interface";

export interface IUser extends IBaseEntity {
  username: string;
  password: string;
}

//const user = await User.findOne({ username }).select('+password');

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      select: false,
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
    toObject: {
      transform: (doc, ret) => {
        const { password, ...rest } = ret;
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
