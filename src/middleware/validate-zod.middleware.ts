import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod/v3";

export const validateZod = (schema: AnyZodObject) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(request.body);

      request.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return response.status(400).json({
          message: error.errors[0].message,
        });
      }
      next(error);
    }
  };
};
