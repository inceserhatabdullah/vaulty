import { Request, Response, NextFunction } from "express";
import { JwtService } from "../services/jwt.service";
import { JwtTypeValue } from "../types/jwt.type";
import { redisService } from "../services/redis.service";

export const authMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const header = request.headers.authorization;

    if (!header) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const token = header.replace(/^Bearer\s+/i, "");

    // black list access token after refresh and logout
    const blackListKey = redisService.getBlackListedAccessTokenConstant(token);
    const isBlacklisted = await redisService.get(blackListKey);

    if (isBlacklisted === "true") {
      return response.status(401).json({
        message: "Token has been revoked. Please login again.",
        code: "TOKEN_REVOKED",
      });
    }

    const verified = JwtService.verify(token, JwtTypeValue.access_token);

    if (!verified) {
      return response.status(401).json({
        message: "Token expired or invalid",
        code: "TOKEN_EXPIRED_OR_INVALID",
      });
    }

    if (!verified.user._id) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    request.authorization = { user: { _id:verified.user._id, },  accessToken: token };

    next();
  } catch (error: any) {
    return response.status(401).json({ message: error.message });
  }
};
