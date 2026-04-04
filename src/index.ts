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

    server = app.listen(Number(port), `${process.env.DYNAMIC_HOST}`, () => {
      console.log(`Vaulty running on: ${port}`);
    });

    app.use("/api/v1", routes);
  } catch (error) {
    console.error("Server error: ", error);

    if (!server) {
      process.exit(0);
    }

    server.close(() => {
      console.warn("Server shutdown..");
      process.exit(0);
    });
  }
})();
