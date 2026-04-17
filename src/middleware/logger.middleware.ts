import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../models/app/error.model";
import logger from "../functions/logger.function";

export const errorMiddleware: ErrorRequestHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  error.code = error.statusCode ?? error.code ?? 500;

  logger.error(
    `${error.code} - ${error.message} - ${request.originalUrl} - ${request.method} - ${request.ip} `,
    {
      stack: error.stack,
    },
  );

  if (error.name === "ZodError" || error.errors) {
    return response.status(400).json({ message: error.errors[0].message });
  }

  if (error instanceof AppError) {
    return response.status(error.code).json({ message: error.message });
  }

  response.status(error.code).json({
    message: error.message ?? "Internal Server Error",
  });
};

export const requestLoggerMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  response.on("finish", () => {
    const infoStatus = response.statusCode >= 200 && response.statusCode < 400;
    const warnStatus = response.statusCode >= 400 && response.statusCode < 500;
    const message = `${response.statusCode} - ${request.originalUrl} ${request.method} - ${request.ip}`;
    if (infoStatus) {
      logger.info(message);
    } else if (warnStatus) {
      logger.warn(message);
    }
  });
  next();
};
