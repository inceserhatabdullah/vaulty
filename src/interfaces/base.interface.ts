import { Document } from "mongoose";

export interface IBaseEntity extends Document<string> {
  _id: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
