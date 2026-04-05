import { Request, Response, NextFunction } from "express";
import { JwtService } from "../services/jwt.service";
import { tokenRepository } from "../repositories/token.repository";

export const verifyTokenMiddleware = async (
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
    const decoded = await JwtService.verifyToken(token);

    if (!decoded) {
      return response.status(401).json({
        message: "Token expired or invalid",
        code: "TOKEN_EXPIRED_OR_INVALID",
      });
    }

    const storedToken = await tokenRepository.findOne({
      token,
      userId: decoded.userId,
    });

    if (!storedToken) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    request.user = { _id: decoded.userId };

    next();
  } catch (error: any) {
    return response.status(401).json({ message: error });
  }
};
