import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import routes from "./routes";

dotenv.config({ path: ".env" });

const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.set("trust proxy", true);

const port = process.env.PORT;

const server = app.listen(Number(port), `${process.env.DYNAMIC_HOST}`, () => {
  console.log(`Vaulty running on: ${port}`);
});

server.on("error", (error: any) => {
  console.error("Server error: ", error);
  server.close(() => {
    console.warn("Server shutdown..");
    process.exit(0);
  });
});

app.use("/api/v1", routes);
