import { z } from "zod/v3";

import { AuthRequestDto } from "../dtos/auth.dto";

export type SigninRequestType = z.infer<typeof AuthRequestDto.signin>;
export type SignupRequestType = z.infer<typeof AuthRequestDto.signup>;
export type ChangePasswordRequestType = z.infer<typeof AuthRequestDto.changePassword>;
