import { z } from "zod/v3";

export const createSecretRequestDto = z.object({
  body: z.object({
    key: z
      .string({
        required_error: "Key is required",
        invalid_type_error: "Key must be a string",
      })
      .min(1, "Key must be at least 1 character long"),
    value: z
      .string({
        required_error: "Value is required",
        invalid_type_error: "Value must be a string",
      })
      .min(1, "Value must be at least 1 character long"),
    title: z.string().optional(),
    category: z.string().optional().default("General"),
    encrypted: z.boolean().optional().default(false),
  }),
});
