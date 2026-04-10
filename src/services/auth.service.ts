import { Request, Response } from "express";
import { userService } from "./user.service";
import { sessionService } from "./session.service";
import { IUser } from "../models/user.model";
import { EncryptionService } from "./encryption.service";
import { JwtTypeValue } from "../types/jwt.type";
import { JwtService } from "./jwt.service";

export class AuthService {
  constructor() {}

  async signup(request: Request) {
    const { username, password, pin } = request.body as IUser;

    const user = await userService.findOne({ username });

    if (user) {
      throw new Error("User already exists.");
    }

    const newUser = await userService.create({
      username,
      password,
      pin,
    });

    const { accessToken, refreshToken, expiresAt } =
      this.generateAndStoreTokens({ userId: newUser._id });

    await sessionService.create({
      token: refreshToken,
      userId: newUser._id,
      expiresAt,
      information: request.session,
    });

    return { accessToken, refreshToken };
  }

  async signin(request: Request) {
    const { username, password } = request.body;

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

    const { accessToken, refreshToken, expiresAt } =
      this.generateAndStoreTokens({ userId: user._id });

    await sessionService.update(
      {
        userId: user._id,
        "information.os.name": request.session.os.name,
        "information.browser.name": request.session.browser.name,
      },
      {
        expiresAt,
        token: refreshToken,
        information: request.session,
      },
    );

    return { accessToken, refreshToken };
  }

  async refresh(request: Request, response: Response) {
    const { refreshToken } = request.cookies;

    if (!refreshToken) {
      throw new Error("No refresh token provided.");
    }

    const decoded = JwtService.verify(refreshToken, JwtTypeValue.refresh_token);

    const session = await sessionService.findOne({
      userId: decoded.user._id,
      token: refreshToken,
      "information.os.name": request.session.os.name,
      "information.browser.name": request.session.browser.name,
    });

    if (!session) {
      await sessionService.softDeleteMany({
        userId: decoded.user._id,
        "information.os.name": request.session.os.name,
        "information.browser.name": request.session.browser.name,
      });

      this.clearCookie(response);

      throw new Error("Session not found.");
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      expiresAt,
    } = this.generateAndStoreTokens({ userId: decoded.user._id });

    await sessionService.update(
      {
        userId: decoded.user._id,
        token: refreshToken,
        "information.os.name": request.session.os.name,
        "information.browser.name": request.session.browser.name,
      },
      {
        expiresAt,
        token: newRefreshToken,
        information: request.session,
      },
    );

    return { accessToken, refreshToken: newRefreshToken };
  }

  private generateAndStoreTokens(request: { userId: string }) {
    const { userId } = request;

    const accessToken = JwtService.generate(
      {
        userId,
      },
      JwtTypeValue.access_token,
    );

    const refreshToken = JwtService.generate(
      {
        userId,
      },
      JwtTypeValue.refresh_token,
    );

    const decoded = JwtService.decode(refreshToken);
    const expiresAt = JwtService.calculateExpiry(decoded);

    return { accessToken, refreshToken, expiresAt };
  }

  setRefreshTokenCookie(response: Response, token: string) {
    const cookie = JwtService.getTokenCookie(JwtTypeValue.refresh_token);
    response.cookie("refreshToken", token, cookie);
  }

  private clearCookie(response: Response) {
    response.clearCookie("refreshToken", { path: "/api/v1/auth/refresh" });
  }

  async logout(request: Request, response: Response) {
    const clearAll = request.query?.all === "true";
    const decoded = JwtService.verify(
      request.authorization!.accessToken,
      JwtTypeValue.access_token,
    );

    if (clearAll) {
      await sessionService.softDeleteMany({ userId: decoded.user._id });
    } else {
      await sessionService.softDelete({
        userId: decoded.user._id,
        "information.os.name": request.session.os.name,
        "information.browser.name": request.session.browser.name,
      });
    }

    this.clearCookie(response);
  }

  generatePassword(): string {
    return EncryptionService.generatePassword();
  }
}

export const authService = new AuthService();
