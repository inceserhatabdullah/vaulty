import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import logger from "../functions/logger.function";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (request: Request, response: Response, next: NextFunction) => {
    logger.warn(`Rate limit exceeded for IP: ${request.ip}`);

    response
      .status(429)
      .json({ error: "Too many requests, please try again later." });
  },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (request: Request, response: Response, next: NextFunction) => {
    logger.warn(
      `BRUTE-FORCE ALERT: Rate limit exceeded for IP: ${request.ip} on ${request.originalUrl}`,
    );

    response
      .status(429)
      .json({ error: "Too many requests, please try again later." });
  },
});
