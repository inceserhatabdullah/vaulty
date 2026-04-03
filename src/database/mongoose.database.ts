import mongoose from "mongoose";
import { globalEntityPlugin } from "./config/mongoose.config";
mongoose.plugin(globalEntityPlugin);

const defaultMongooseHost = "mongodb://127.0.0.1:27017/vaulty";

export const connectMongoose = async () => {
  const mongooseHost = process.env.MONGO_URI ?? defaultMongooseHost;
  await mongoose.connect(mongooseHost);

  console.log(`Connected to ${mongooseHost}`);
};
