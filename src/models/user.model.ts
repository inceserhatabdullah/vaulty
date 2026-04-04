import { Schema, model, HydratedDocument } from "mongoose";
import { IBaseEntity } from "../interfaces/base.interface";
import { EncryptionService } from "../services/encryption.service";

export interface IUser extends IBaseEntity {
  username: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
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

  this.password = await EncryptionService.hashUserPassword(this.password);
});

export const User = model<IUser>("User", userSchema);
