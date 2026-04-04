import bcrypt from "bcryptjs";
import argon2 from "argon2";
import crypto from "crypto";

export class EncryptionService {
  private static readonly ENCRYPTION_ALGORITHM =
    process.env.ENCRYPTION_ALGORITHM || "aes-256-cbc";

  private static readonly argon2Config = {
    type: argon2.argon2id,
    memoryCost: 2 ** 14, // 16 MB memory cost
    timeCost: 2, // 2 iterations
    parallelism: 1, // 1 thread
    hashLength: 32, // 32 bytes hash length
    raw: true, // return raw buffer
  };

  static async hashUserPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    return hashed;
  }

  static async compareUserPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async encryptSecretItem(request: {
    userId: string;
    encryptionKey: string;
    data: string;
  }): Promise<string> {
    const hashed = await argon2.hash(request.encryptionKey, {
      ...this.argon2Config,
      salt: Buffer.from(request.userId),
    });

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(this.ENCRYPTION_ALGORITHM, hashed, iv);
    const encrypted =
      cipher.update(request.data, "utf8", "hex") + cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
  }

  static async decryptSecretItem(request: {
    userId: string;
    encryptionKey: string;
    data: string;
  }): Promise<string> {
    const [ivHex, encrypted] = request.data.split(":");
    if (!ivHex || !encrypted) {
      throw new Error("Invalid encrypted data.");
    }

    const hashed = await argon2.hash(request.encryptionKey, {
      ...this.argon2Config,
      salt: Buffer.from(request.userId),
    });

    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(
      this.ENCRYPTION_ALGORITHM,
      hashed,
      iv,
    );
    const decrypted =
      decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");

    return decrypted;
  }
}
