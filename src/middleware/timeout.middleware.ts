import { Request, Response, NextFunction, request } from "express";

export function timeoutMiddleware(seconds: number) {
  return (request: Request, response: Response, next: NextFunction) => {
    const timer = setTimeout(() => {
      if (!response.headersSent) {
        response.status(504).json({
          error: "Gateway Timeout",
          message: `Request timed out after ${seconds} seconds`,
        });
      }
    }, seconds * 1000);

    response.on("finish", () => clearTimeout(timer));
    response.on("close", () => clearTimeout(timer));

    next();
  };
}
