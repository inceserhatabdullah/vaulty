import { z } from "zod/v3";

const secretDTO = z.object({
  key: z.string(),
  value: z.string(),
  title: z.string().optional(),
  category: z.string().optional().default("General"),
  encrypted: z.boolean().optional().default(false),
});

export const SecretRequestDto = {
  create: secretDTO.pick({ key: true, value: true }),
  update: secretDTO.partial(),
};
