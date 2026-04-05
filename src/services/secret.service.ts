export class SecretService {
  constructor(private readonly secretRepository: SecretRepository) {}

  async create(request: ISecret & { encryptionKey: string }) {
    const secret = await this.secretRepository.findOne({ key: request.key });

    if (secret) {
      throw new Error("Secret with this key already exists.");
    }

    if (!request.encrypted && !request.encryptionKey) {
      throw new Error("Encryption key is required for encrypted secrets.");
    }

    const encryptedValue = await EncryptionService.encryptSecretItem({
      userId: request.userId,
      data: request.value,
      encryptionKey: request.encryptionKey,
    });

    request.value = encryptedValue;

    const newSecret = await this.secretRepository.create(request);
    return newSecret;
  }

  async find(filter: QueryFilter<ISecret>) {
    const secrets = await this.secretRepository.find(filter);
    return secrets;
  }

  async findOne(filter: QueryFilter<ISecret>) {
    const secret = await this.secretRepository.findOne(filter);
    return secret;
  }
}

import { QueryFilter } from "mongoose";
import { ISecret } from "../models/secret.model";
import {
  SecretRepository,
  secretRepository,
} from "../repositories/secret.repository";
import { EncryptionService } from "./encryption.service";

export const secretService = new SecretService(secretRepository);
