import { Request, Response, NextFunction, request } from "express";

export function requestHeaderMiddleware(header: string) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.headers[header]) {
      response.status(400).json({
        error: "Bad Request",
        message: `Missing required header: ${header}`,
      });
      return;
    }

    next();
  };
}
