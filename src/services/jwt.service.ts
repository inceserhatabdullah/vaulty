import jwt, { JwtPayload } from "jsonwebtoken";
import ms from "ms";
import { JWTType, JwtTypeValue } from "../types/jwt.type";

export class JwtService {
  private static readonly jwtConfiguration: Record<
    JWTType,
    { secret: string; expiresIn: ms.StringValue }
  > = {
    [JwtTypeValue.access_token]: {
      secret: process.env.ACCESS_TOKEN_SECRET ?? "super_secret",
      expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN ??
        "1h") as ms.StringValue,
    },
    [JwtTypeValue.refresh_token]: {
      secret: process.env.REFRESH_TOKEN_SECRET ?? "super_secret",
      expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN ??
        "7d") as ms.StringValue,
    },
  };

  static generate(request: { userId: string }, type: JWTType): string {
    const configuration = this.jwtConfiguration[type];
    const { secret, expiresIn } = configuration as {
      secret: string;
      expiresIn: ms.StringValue;
    };

    const token = jwt.sign({ user: { _id: request.userId } }, secret, {
      expiresIn,
    });

    return token;
  }

  static verify(token: string, type: JWTType): { user: { _id: string } } {
    const configuration = this.jwtConfiguration[type];
    const { secret } = configuration as { secret: string };

    const verified = jwt.verify(token, secret);
    return verified as { user: { _id: string } };
  }

  static decode(token: string): JwtPayload {
    return jwt.decode(token) as JwtPayload;
  }

  static calculateExpiry(payload: JwtPayload): Date {
    return new Date(1000 * payload.exp!);
  }

  static getExpiry(type: JWTType) {
    const configuration = this.jwtConfiguration[type];
    const { expiresIn } = configuration as { expiresIn: ms.StringValue };
    return ms(expiresIn);
  }

  static getTokenCookie(type: JWTType) {
    const configuration = this.jwtConfiguration[type];
    const { expiresIn } = configuration as { expiresIn: ms.StringValue };

    return {
      httpOnly: true,
      secure: true,
      sameSite: "strict" as const,
      path: "/api/v1/auth/refresh",
      maxAge: ms(expiresIn),
    };
  }
}
