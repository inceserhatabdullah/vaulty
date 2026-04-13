import { z } from "zod/v3";
import { regex } from "../constants/regex.constant";

const userDTO = z.object({
  username: z.string(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      regex.password,
      "Password must contain at least one letter, one number, and one special character",
    ),
  pin: z
    .string()
    .min(4, "PIN must be at least 4 characters")
    .regex(
      regex.pin,
      "Pin must contain at least one letter, one number, and one special character",
    ),
});

export const AuthRequestDto = {
  signin: userDTO.pick({ username: true, password: true }),

  signup: userDTO,

  changePassword: userDTO.pick({ password: true }),
};
