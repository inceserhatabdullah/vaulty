import { JwtService } from "../services/jwt.service";
import { getJwtExpiresAt } from "../functions/jwt.function";
import { EncryptionService } from "./encryption.service";

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
    const generatedToken = await JwtService.generateToken({
      userId: newUser._id,
    });

    const newToken = await this.tokenRepository.create({
      userId: newUser._id,
      token: generatedToken,
      expiresAt: getJwtExpiresAt(),
    });

    return { newUser, newToken };
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

    await this.tokenRepository.softDeleteMany({ userId: user._id });

    const generatedToken = await JwtService.generateToken({
      userId: user._id,
    });

    const newToken = await this.tokenRepository.create({
      userId: user._id,
      token: generatedToken,
      expiresAt: getJwtExpiresAt(),
    });

    return { user, newToken };
  }
}

import {
  TokenRepository,
  tokenRepository,
} from "../repositories/token.repository";
import {
  UserRepository,
  userRepository,
} from "../repositories/user.repository";
import { IUser } from "../models/user.model";

export const authService = new AuthService(userRepository, tokenRepository);
