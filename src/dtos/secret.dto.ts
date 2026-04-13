import { z } from "zod/v3";

const secretDTO = z.object({
  key: z.string({ required_error: "Key is required" }),
  value: z.string({ required_error: "Value is required" }),
  title: z.string().optional(),
  category: z.string().optional().default("General"),
  encrypted: z.boolean().optional().default(false),
});

export const SecretRequestDto = {
  create: secretDTO,
  update: secretDTO.partial(),
};
