import { z } from "zod/v3";
import { regex } from "../constants/regex.constant";

export const userDTO = {
  username: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username must be a string",
    })
    .min(1, "Username must be at least 1 character"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters")
    .regex(
      regex.password,
      "Password must contain at least one letter, one number, and one special character",
    ),
  pin: z
    .string({
      required_error: "PIN is required",
    })
    .min(4, "PIN must be at least 4 characters")
    .regex(
      regex.pin,
      "Pin must contain at least one letter, one number, and one special character",
    ),
};
