import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod/v3";

export const validateZod = (schema: AnyZodObject) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(request.body);

      request.body = parsed;
      next();
    } catch (error) {
      next(error);
    }
  };
};
