import { Request, Response } from "express";
import { secretService } from "../services/secret.service";
import { requestHeader } from "../constants/request-header.constant";
import { identityContext } from "../functions/identity-context.function";
import { JwtService } from "../services/jwt.service";
import { JwtTypeValue } from "../types/jwt.type";
import { catchAsync } from "../functions/catch-async.function";

export const create = catchAsync(
  async (request: Request, response: Response) => {
    const context = identityContext(request);

    const newSecret = await secretService.create(request.body, context);
    return response.status(201).json(newSecret);
  },
);

export const find = catchAsync(async (request: Request, response: Response) => {
  const context = identityContext(request);

  const verified = JwtService.verify(
    context.accessToken,
    JwtTypeValue.access_token,
  );

  const secrets = await secretService.find({ userId: verified.user._id });

  return response.status(200).json(secrets);
});

export const decrypt = catchAsync(
  async (request: Request, response: Response) => {
    const vaultPin = request.headers[requestHeader.vaultPin] as string;

    const context = identityContext(request);

    const verified = JwtService.verify(
      context.accessToken,
      JwtTypeValue.access_token,
    );

    const decryptedValue = await secretService.decrypt({
      _id: request.params.id as string,
      userId: verified.user._id,
      vaultPin,
    });

    return response.status(200).json({ value: decryptedValue });
  },
);

export const update = catchAsync(
  async (request: Request, response: Response) => {
    await secretService.update(
      { _id: request.params.id as string },
      request.body,
    );
    return response.status(200).json();
  },
);

export const _delete = catchAsync(
  async (request: Request, response: Response) => {
    await secretService.delete({ _id: request.params.id as string });
    return response.status(200).json();
  },
);
