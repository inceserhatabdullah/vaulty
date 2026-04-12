import { Schema, Query } from "mongoose";
import { generateUUID } from "../../functions/generate-uuid.function";

export const globalEntityPlugin = (schema: Schema) => {
  schema.add({
    _id: { type: String, default: () => generateUUID() },
    isDeleted: { type: Boolean, default: false },
  });

  schema.set("timestamps", true);
  schema.set("versionKey", false);

  const findMethods = [
    "find",
    "findOne",
    "findOneAndUpdate",
    "countDocuments",
    "findOneAndDelete",
  ] as any;

  schema.pre(findMethods, function (this: Query<any, any>) {
    this.where({ isDeleted: { $ne: true } });
  });
};
