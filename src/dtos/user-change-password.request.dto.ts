import { z } from "zod/v3";
import { userDTO } from "./user.dto";

export const userChangePasswordRequestDto = z.object({
  body: z.object({
    password: userDTO.password,
  }),
});
