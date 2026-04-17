import { Request, Response, NextFunction } from "express";
import { JwtService } from "../services/jwt.service";
import { JwtTypeValue } from "../types/jwt.type";
import { redisService } from "../services/redis.service";
import { sessionService } from "../services/session.service";

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

    const verified = JwtService.verify(token, JwtTypeValue.access_token);

    if (!verified) {
      return response.status(401).json({
        message: "Token expired or invalid",
        code: "TOKEN_EXPIRED_OR_INVALID",
      });
    }

    // black list access token after refresh and logout
    const blackListKey = redisService.getBlackListedAccessTokenConstant(token);
    const isBlacklisted = await redisService.get(blackListKey);

    if (isBlacklisted === "true") {
      return response.status(401).json({
        message: "Token has been revoked. Please login again.",
        code: "TOKEN_REVOKED",
      });
    }

    const session = await sessionService.findOne({ _id: verified.session._id });

    if (!session) {
      return response.status(401).json({
        message: "The session has been terminated. Please login again.",
      });
    }

    request._vaulty_ = {
      auth: {
        ...request._vaulty_.auth,
        accessToken: token,
      } as Express.VaultyAuthType,
    };

    next();
  } catch (error: any) {
    return response.status(401).json({ message: error.message });
  }
};
