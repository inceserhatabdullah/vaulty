import { Schema, model } from "mongoose";
import { IBaseEntity } from "../interfaces/base.interface";

export interface ISecret extends IBaseEntity {
  userId: string;
  key: string;
  value: string;
  title: string;
  category: string;
  encrypted: boolean;
}

const secretSchema = new Schema<ISecret>({
  userId: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true, select: false },
  title: { type: String, required: false },
  category: { type: String, required: false, default: "General" },
  encrypted: { type: Boolean, required: true, default: false },
});

export const Secret = model<ISecret>("Secret", secretSchema);
