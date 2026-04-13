import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../models/app/error.model";

export const globalErrorMiddleware: ErrorRequestHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  error.code = error.statusCode ?? error.code ?? 500;

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
