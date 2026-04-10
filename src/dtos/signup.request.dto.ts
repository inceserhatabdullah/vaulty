import { z } from "zod/v3";
import { signinRequestDto } from "./signin.request.dto";
import { regex } from "../constants/regex.constant";

export const signupRequestDto = z.object({
  body: signinRequestDto.shape.body.extend({
    pin: z
      .string({
        required_error: "Pin is required",
        invalid_type_error: "Pin must be a string",
      })
      .min(6, "Pin must be at least 6 characters")
      .regex(
        regex.pin,
        "Pin must contain at least one letter, one number, and one special character",
      ),
  }),
});
