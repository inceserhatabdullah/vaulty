import { z } from "zod/v3";

export const refreshTokenRequestDto = z.object({
  body: z.object({
    refreshToken: z
      .string({
        required_error: "refreshToken key is required.",
        invalid_type_error: "refreshToken key must be a string.",
      })
      .trim()
      .min(1, "refreshToken key must be at least 1 character."),
  }),
});
