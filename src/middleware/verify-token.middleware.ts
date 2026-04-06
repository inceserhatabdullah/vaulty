import { Request, Response, NextFunction } from "express";
import { JwtService } from "../services/jwt.service";
import { JwtTypeValue } from "../types/jwt.type";

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
    const decoded = JwtService.verify(token, JwtTypeValue.access_token);

    if (!decoded) {
      return response.status(401).json({
        message: "Token expired or invalid",
        code: "TOKEN_EXPIRED_OR_INVALID",
      });
    }

    if (!decoded.user._id) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    // const storedToken = await tokenRepository.findOne({
    //   token,
    //   userId: decoded.user._id,
    // });

    // if (!storedToken) {
    //   return response.status(401).json({ message: "Unauthorized" });
    // }

    request.user = { _id: decoded.user._id };

    next();
  } catch (error: any) {
    return response.status(401).json({ message: error.message });
  }
};
