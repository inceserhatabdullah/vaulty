import { Request, Response } from "express";
import { userService } from "./user.service";
import { sessionService } from "./session.service";
import { IUser } from "../models/user.model";
import { EncryptionService } from "./encryption.service";
import { JwtTypeValue } from "../types/jwt.type";
import { JwtService } from "./jwt.service";
import { redisService } from "./redis.service";
import { generateUUID } from "../functions/generate-uuid.function";
import { SigninRequestType, SignupRequestType } from "../types/auth.type";
import { ISession } from "../models/session.model";

export class AuthService {
  constructor() {}

  async signup(
    payload: SignupRequestType,
    identityContext: Express.VaultyAuthType,
  ) {
    const { username, password, pin } = payload;

    const user = await userService.findOne({ username });

    if (user) {
      throw new Error("User already exists.");
    }

    const newUser = await userService.create({
      username,
      password,
      pin,
    });

    const sessionId: string = generateUUID();

    const { accessToken, refreshToken, expiresAt } =
      this.generateAndStoreTokens({ userId: newUser._id, sessionId });

    await sessionService.create({
      _id: sessionId,
      token: refreshToken,
      userId: newUser._id,
      expiresAt,
      information: identityContext.session,
    } as ISession);

    return { accessToken, refreshToken };
  }

  async signin(
    payload: SigninRequestType,
    identityContext: Express.VaultyAuthType,
  ) {
    const { username, password } = payload;

    const user = await userService.findOne({ username }, "+password");

    if (!user) {
      throw new Error("Invalid credentials.");
    }

    const isPasswordValid = await EncryptionService.verify({
      password,
      hashedPassword: user.password,
    });

    if (!isPasswordValid) {
      throw new Error("Invalid credentials.");
    }

    const session = await sessionService.findOne({
      userId: user._id,
      "information.os.name": identityContext.session.os.name,
      "information.browser.name": identityContext.session.browser.name,
    });

    const sessionId = session ? session._id : generateUUID();

    const { accessToken, refreshToken, expiresAt } =
      this.generateAndStoreTokens({
        userId: user._id,
        sessionId,
      });

    await sessionService.update(
      {
        _id: sessionId,
      },
      {
        expiresAt,
        token: refreshToken,
        information: identityContext.session,
      },
    );

    return { accessToken, refreshToken };
  }

  async refresh(
    cookies: Record<string, any>,
    identityContext: Express.VaultyAuthType,
  ) {
    const { refreshToken } = cookies;

    if (!refreshToken) {
      throw new Error("No refresh token provided.");
    }

    const decoded = JwtService.verify(refreshToken, JwtTypeValue.refresh_token);

    const session = await sessionService.findOne({
      userId: decoded.user._id,
      token: refreshToken,
      "information.os.name": identityContext.session.os.name,
      "information.browser.name": identityContext.session.browser.name,
    });

    if (!session) {
      await sessionService.softDelete({
        userId: decoded.user._id,
        "information.os.name": identityContext.session.os.name,
        "information.browser.name": identityContext.session.browser.name,
      });

      throw new Error("Session not found.");
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      expiresAt,
    } = this.generateAndStoreTokens({
      userId: decoded.user._id,
      sessionId: session._id,
    });

    await this.setBlackListAccessToken(identityContext.accessToken);

    await sessionService.update(
      {
        _id: session._id,
      },
      {
        expiresAt,
        token: newRefreshToken,
        information: identityContext.session,
      },
    );

    return { accessToken, refreshToken: newRefreshToken };
  }

  private generateAndStoreTokens(request: {
    userId: string;
    sessionId: string;
  }) {
    const { userId, sessionId } = request;

    const accessToken = JwtService.generate(
      {
        userId,
        sessionId,
      },
      JwtTypeValue.access_token,
    );

    const refreshToken = JwtService.generate(
      {
        userId,
        sessionId,
      },
      JwtTypeValue.refresh_token,
    );

    const decoded = JwtService.verify(refreshToken, JwtTypeValue.refresh_token);
    const expiresAt = JwtService.calculateExpiry(decoded);

    return { accessToken, refreshToken, expiresAt };
  }

  setRefreshTokenCookie(response: Response, token: string) {
    const cookie = JwtService.getTokenCookie(JwtTypeValue.refresh_token);
    response.cookie("refreshToken", token, cookie);
  }

  clearCookie(response: Response) {
    response.clearCookie("refreshToken", { path: "/api/v1/auth/refresh" });
  }

  async logout(
    identityContext: Express.VaultyAuthType,
    clearAll: boolean = false,
  ) {
    const verified = JwtService.verify(
      identityContext.accessToken,
      JwtTypeValue.access_token,
    );

    await this.setBlackListAccessToken(identityContext.accessToken);

    if (clearAll) {
      await sessionService.softDeleteMany({ userId: verified.user._id });
    } else {
      await sessionService.softDelete({
        _id: verified.session._id,
      });
    }
  }

  async setBlackListAccessToken(accessToken: string) {
    const payload = JwtService.verify(accessToken, JwtTypeValue.access_token);
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = payload.exp! - now + 10;
    const blackListKey =
      redisService.getBlackListedAccessTokenConstant(accessToken);

    if (expiresIn > 0) {
      await redisService.set(blackListKey, true, expiresIn);
    }
  }

  generatePassword(): string {
    return EncryptionService.generatePassword();
  }
}

export const authService = new AuthService();
