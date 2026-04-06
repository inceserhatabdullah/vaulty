export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async signup(request: IUser) {
    const { username, password } = request;

    const user = await this.userRepository.findOne({ username });

    if (user) {
      throw new Error("User already exists.");
    }

    const newUser = await this.userRepository.create({ username, password });

    return this.generateAndStoreTokens({ userId: newUser._id });
  }

  async signin(request: IUser) {
    const { username, password } = request;

    const user = await this.userRepository.findOneWithPassword({ username });

    if (!user) {
      throw new Error("Invalid credentials.");
    }

    const isPasswordValid = await EncryptionService.compareUserPassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error("Invalid credentials.");
    }

    return this.generateAndStoreTokens({ userId: user._id });
  }

  private async generateAndStoreTokens(request: { userId: string }) {
    const { userId } = request;

    const accessToken = JwtService.generateToken(
      {
        userId,
      },
      JwtTypeValue.access_token,
    );

    const refreshToken = JwtService.generateToken(
      {
        userId,
      },
      JwtTypeValue.refresh_token,
    );

    await this.tokenRepository.create({
      userId,
      token: refreshToken,
      expiresAt: JwtService.calculateTokenExpires(JwtTypeValue.refresh_token),
    });

    return { accessToken, refreshToken };
  }
}

import { JwtService } from "../services/jwt.service";
import { EncryptionService } from "./encryption.service";

import {
  TokenRepository,
  tokenRepository,
} from "../repositories/token.repository";
import {
  UserRepository,
  userRepository,
} from "../repositories/user.repository";
import { IUser } from "../models/user.model";
import { JwtTypeValue } from "../types/jwt.type";

export const authService = new AuthService(userRepository, tokenRepository);
