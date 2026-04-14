import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../models/app/error.model";
import logger from "../functions/logger.function";

export const globalErrorMiddleware: ErrorRequestHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  error.code = error.statusCode ?? error.code ?? 500;

  console.log(' error ', error)
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
