import { z } from "zod/v3";
import { regex } from "../constants/regex.constant";

export const signinRequestDto = z.object({
  body: z.object({
    username: z
      .string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
      })
      .min(1, "Username must be at least 1 character"),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(6, "Password must be at least 6 characters")
      .regex(
        regex.password,
        "Password must contain at least one letter, one number, and one special character",
      ),
  }),
});
