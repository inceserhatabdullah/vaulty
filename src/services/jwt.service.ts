import jwt from "jsonwebtoken";
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

    const decoded = jwt.verify(token, secret);
    return decoded as { user: { _id: string } };
  }

  static calculateTokenExpires(type: JWTType): Date {
    const configuration = this.jwtConfiguration[type];
    return new Date(Date.now() + ms(configuration.expiresIn as ms.StringValue));
  }
}
