import { Schema, model } from "mongoose";
import { IBaseEntity } from "../interfaces/base.interface";

export interface IToken extends IBaseEntity {
  userId: string;
  token: string;
  expiresAt: Date;
}

const tokenSchema = new Schema<IToken>({
  userId: { type: String, required: true, ref: "User" },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

// remove token when expired
//tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Token = model<IToken>("Token", tokenSchema);
