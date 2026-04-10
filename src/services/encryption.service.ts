import argon2 from "argon2";
import crypto from "crypto";
import { generate } from "generate-password";

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

  static async hash(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  static async verify(request: {
    password: string;
    hashedPassword: string;
  }): Promise<boolean> {
    const { password, hashedPassword } = request;
    return await argon2.verify(hashedPassword, password);
  }

  static async encrypt(request: { password: string; data: string }) {
    const { password, data } = request;

    const hash = await argon2.hash(password, {
      ...this.argon2Config,
      salt: Buffer.from(process.env.USER_VAULTY_PIN as string),
    });

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(this.ENCRYPTION_ALGORITHM, hash, iv);
    const encrypted = cipher.update(data, "utf8", "hex") + cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  }

  static async decrypt(request: {
    password: string;
    data: string;
  }): Promise<string> {
    const { password, data } = request;

    const hash = await argon2.hash(password, {
      ...this.argon2Config,
      salt: Buffer.from(process.env.USER_VAULTY_PIN as string),
    });

    const [ivHex, encrypted] = data.split(":");
    if (!ivHex || !encrypted) {
      throw new Error("Invalid encrypted data");
    }

    const decipher = crypto.createDecipheriv(
      this.ENCRYPTION_ALGORITHM,
      hash,
      Buffer.from(ivHex, "hex"),
    );
    return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
  }

  static generatePassword(): string {
    return generate({
      length: 20,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true,
      strict: true,
    });
  }
}
