import { Request, Response } from "express";
import { secretService } from "../services/secret.service";
import { requestHeader } from "../constants/request-header.constant";

export const create = async (request: Request, response: Response) => {
  try {
    const userId = request.user?._id;

    const newSecret = await secretService.create({ ...request.body, userId });
    return response.status(201).json(newSecret);
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};

export const find = async (request: Request, response: Response) => {
  try {
    const userId = request.user?._id as string;

    const secrets = await secretService.find({ userId });

    return response.status(200).json(secrets);
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};

export const decrypt = async (request: Request, response: Response) => {
  try {
    const vaultPin = request.headers[requestHeader.vaultPin] as string;

    const decryptedValue = await secretService.decrypt({
      _id: request.params.id as string,
      userId: request.user?._id,
      vaultPin,
    });

    return response.status(200).json({ value: decryptedValue });
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};
