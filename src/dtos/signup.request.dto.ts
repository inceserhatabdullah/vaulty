import { z } from "zod/v3";
import { signinRequestDto } from "./signin.request.dto";
import { userDTO } from "./user.dto";

export const signupRequestDto = z.object({
  body: signinRequestDto.shape.body.extend({
    pin: userDTO.pin,
  }),
});
