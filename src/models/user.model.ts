import { Schema, model, HydratedDocument } from "mongoose";
import { IBaseEntity } from "../interfaces/base.interface";
import { EncryptionService } from "../services/encryption.service";

export interface IUser extends IBaseEntity {
  username: string;
  password: string;
  pin: string;
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
    },
    pin: {
      type: String,
      required: true,
      select: false,
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
  if (this.isModified("password")) {
    this.password = await EncryptionService.hash(this.password);
  }

  if (this.isModified("pin")) {
    this.pin = await EncryptionService.hash(this.pin);
  }
});

export const User = model<IUser>("User", userSchema);
