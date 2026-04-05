import e, { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod/v3";

export const validateZod = (schema: AnyZodObject) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      console.log(request.body);
      await schema.parseAsync({ body: request.body });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const parsedError = JSON.parse(error.message);
        const [_] = parsedError;

        console.log(parsedError);
        return response.status(400).json({
          message: _.message,
        });
      }
      next(error);
    }
  };
};
