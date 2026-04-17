import { Schema, model } from "mongoose";
import { IBaseEntity } from "../interfaces/base.interface";

export interface ISession extends IBaseEntity {
  userId: string;
  token: string;
  expiresAt: Date;
  information: object;
}

const sessionSchema = new Schema<ISession>({
  userId: { type: String, required: true, ref: "User" },
  token: { type: String, required: true, unique: true, select: false },
  expiresAt: { type: Date, required: true, index: { expires: 0 }, select: false },
  information: { type: Object, required: false },
});

export const Session = model<ISession>("Session", sessionSchema);
