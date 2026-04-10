import { connectMongoose } from "./database/mongoose.database";
import express from "express";
import morgan from "morgan";
import routes from "./routes";
import http from "http";
import cookieParser from "cookie-parser";

const app = express();
app.use(morgan("combined"));
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", true);

const port = process.env.PORT;
app.use("/api/v1", routes);

(async () => {
  let server: http.Server | undefined;
  try {
    await connectMongoose();

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
