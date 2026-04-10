import mongoose from "mongoose";
import { globalEntityPlugin } from "./config/mongoose.config";
mongoose.plugin(globalEntityPlugin);

export const connectMongoose = async () => {
  const mongooseHost = process.env.MONGO_URI;

  if (!mongooseHost) {
    throw new Error("MONGO_URI environment variable is not set");
  }

  const { connection } = await mongoose.connect(mongooseHost);

  console.log(`Database connected successfully. ${connection.host}:${connection.port}/${connection.name}`);
};
