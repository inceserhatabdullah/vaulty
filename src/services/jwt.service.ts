import jwt from "jsonwebtoken";
import { getJwtExpiresIn, getJwtSecret } from "../functions/jwt.function";

export class JwtService {
  static async generateToken(request: { userId: string }): Promise<string> {
    const secret = getJwtSecret();
    const expiresIn = getJwtExpiresIn();

    const token = jwt.sign({ user: { _id: request.userId } }, secret, {
      expiresIn,
    });
    return token;
  }

  static async verifyToken(token: string): Promise<{ user: { _id: string } }> {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret);
    return decoded as { user: { _id: string } };
  }
}
