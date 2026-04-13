import { Request, Response } from "express";
import { secretService } from "../services/secret.service";
import { requestHeader } from "../constants/request-header.constant";
import { identityContext } from "../functions/identity-context.function";
import { JwtService } from "../services/jwt.service";
import { JwtTypeValue } from "../types/jwt.type";

export const create = async (request: Request, response: Response) => {
  try {
    const context = identityContext(request);

    const newSecret = await secretService.create(request.body, context);
    return response.status(201).json(newSecret);
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};

export const find = async (request: Request, response: Response) => {
  try {
    const context = identityContext(request);

    const verified = JwtService.verify(
      context.accessToken,
      JwtTypeValue.access_token,
    );

    const secrets = await secretService.find({ userId: verified.user._id });

    return response.status(200).json(secrets);
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};

export const decrypt = async (request: Request, response: Response) => {
  try {
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
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};

export const update = async (request: Request, response: Response) => {
  try {
    await secretService.update(
      { _id: request.params.id as string },
      request.body,
    );
    return response.status(200).json({ value: "decryptedValue" });
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};
