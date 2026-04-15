import { connectMongoose } from "./database/mongoose.database";
import express from "express";
import routes from "./routes";
import http from "http";
import cookieParser from "cookie-parser";
import {
  errorMiddleware,
  requestLoggerMiddleware,
} from "./middleware/logger.middleware";
import { apiLimiter } from "./middleware/rate-limiter.middleware";

const port = process.env.PORT;

const app = express();

// app.set("trust proxy", true);
app.set("query parser", "extended");

app.use(requestLoggerMiddleware);
app.use(apiLimiter);

//app.use(morgan("combined"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// update coming request object if needed
// app.use((request, response, next) => {
//   const originalQuery = request.query;
//   Object.defineProperty(request, "query", {
//     value: { ...originalQuery },
//     writable: true,
//     configurable: true,
//     enumerable: true,
//   });
//   next();
// });

app.use("/api/v1", routes);


app.use(
  (
    error: any,
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    return errorMiddleware(error, request, response, next);
  },
);

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
