export class SecretService {
  constructor(
    private readonly secretRepository: SecretRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(request: ISecret) {
    const secret = await this.secretRepository.findOne({ key: request.key });

    if (secret) {
      throw new Error("Secret with this key already exists.");
    }

    if (request.encrypted) {
      const user = await this.userRepository.findOne(
        { _id: request.userId },
        "+pin",
      );

      if (!user) {
        throw new Error("User not found.");
      }

      const encrypted = await EncryptionService.encrypt({
        password: user.pin,
        data: request.value,
      });
      request.value = encrypted;
    }

    const newSecret = await this.secretRepository.create(request);
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

export const secretService = new SecretService(
  secretRepository,
  userRepository,
);
