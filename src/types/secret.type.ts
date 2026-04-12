import { z } from "zod/v3";

import { SecretRequestDto } from "../dtos/secret.dto";

export type CreateSecretRequestType = z.infer<typeof SecretRequestDto.create>;
export type UpdateSecretRequestType = z.infer<typeof SecretRequestDto.update>;


// TODO: functiion'larda kullan.
// controller da =>  const body = dto.parse(req.body);