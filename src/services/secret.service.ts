export class SecretService {
  constructor(
    private readonly secretRepository: SecretRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async update(filter: QueryFilter<ISecret>, update: Partial<ISecret>) {
    const secret = await this.secretRepository.findOne(filter, "+value");

    if (!secret) {
      throw new Error("Secret not found.");
    }

    if (update?.encrypted) {
      const user = await this.userRepository.findOne(
        { _id: secret.userId },
        "+pin",
      );

      if (!user) {
        throw new Error("User not found.");
      }

      const data = update.value ?? secret.value;

      const encrypted = await EncryptionService.encrypt({
        password: user.pin,
        data,
      });
      update.value = encrypted;
    } else {
      const user = await this.userRepository.findOne(
        { _id: secret.userId },
        "+pin",
      );

      if (!user) {
        throw new Error("User not found.");
      }

      const data = update.value ?? secret.value;

      const decrypted = await EncryptionService.decrypt({
        password: user?.pin,
        data,
      });

      update.value = decrypted;
    }

    await this.secretRepository.update(filter, update);
  }

  async create(
    payload: CreateSecretRequestType,
    identityContext: Express.VaultyAuthType,
  ) {
    const secret = await this.secretRepository.findOne({ key: payload.key });

    if (secret) {
      throw new Error("Secret with this key already exists.");
    }

    const decoded = JwtService.verify(
      identityContext.accessToken,
      JwtTypeValue.access_token,
    );

    if (payload.encrypted) {
      const user = await this.userRepository.findOne(
        { _id: decoded.user._id },
        "+pin",
      );

      if (!user) {
        throw new Error("User not found.");
      }

      const encrypted = await EncryptionService.encrypt({
        password: user.pin,
        data: payload.value,
      });
      payload.value = encrypted;
    }

    const newSecret = await this.secretRepository.create(payload);
    return { _id: newSecret._id };
  }

  async find(request: { userId: string }) {
    const secrets = await this.secretRepository.find(request);
    return secrets;
  }

  async decrypt(request: Partial<ISecret> & { vaultPin: string }) {
    const user = await this.userRepository.findOne(
      { _id: request.userId },
      "+pin",
    );

    if (!user) {
      throw new Error("User not found.");
    }

    const isVerified = await EncryptionService.verify({
      password: request.vaultPin,
      hashedPassword: user.pin,
    });

    if (!isVerified) {
      throw new Error("Invalid vault pin.");
    }

    const secret = await this.secretRepository.findOne(
      { _id: request._id, userId: user._id },
      "+value",
    );

    if (!secret) {
      throw new Error("Secret not found.");
    }

    if (!secret.encrypted) {
      return secret.value;
    }

    const decrypted = await EncryptionService.decrypt({
      password: user.pin,
      data: secret.value,
    });

    return decrypted;
  }
}

import { QueryFilter } from "mongoose";
import { ISecret } from "../models/secret.model";
import {
  SecretRepository,
  secretRepository,
} from "../repositories/secret.repository";
import {
  UserRepository,
  userRepository,
} from "../repositories/user.repository";
import { EncryptionService } from "./encryption.service";
import { CreateSecretRequestType } from "../types/secret.type";
import { JwtService } from "./jwt.service";
import { JwtTypeValue } from "../types/jwt.type";

export const secretService = new SecretService(
  secretRepository,
  userRepository,
);
