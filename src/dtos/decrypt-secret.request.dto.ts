import { z } from "zod/v3";

export const decryptSecretRequestDto = z.object({
  body: z.object({
    encryptionKey: z
      .string({
        required_error: "Encryption key is required.",
        invalid_type_error: "Encryption key must be a string.",
      })
      .trim()
      .min(1, "Encryption key must be at least 1 character."),
  }),
});
