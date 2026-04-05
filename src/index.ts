import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { connectMongoose } from "./database/mongoose.database";
import express from "express";
import morgan from "morgan";
import routes from "./routes";
import http from "http";

const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.set("trust proxy", true);

const port = process.env.PORT;

(async () => {
  let server: http.Server | undefined;
  try {
    await connectMongoose();

    app.use("/api/v1", routes);

    server = app.listen(Number(port), `${process.env.DYNAMIC_HOST}`, () => {
      console.log(`Vaulty running on: ${port}`);
    });

    process.on("SIGINT", () => shutdown(server));
    process.on("SIGTERM", () => shutdown(server));
  } catch (error) {
    console.error("\nServer error: ", error);

    process.exit(1);
  }
})();

const shutdown = async (server: http.Server | undefined) => {
  console.warn("\nShutdown signal received..");

  if (server) {
    server.close(() => {
      console.warn("\nServer shutdown..");
      process.exit(0);
    });
  }

  process.exit(0);
};
