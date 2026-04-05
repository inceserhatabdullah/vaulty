import { Request, Response } from "express";
import { secretService } from "../services/secret.service";

export const create = async (request: Request, response: Response) => {
  try {
    const userId = request.user?._id;

    const newSecret = await secretService.create({ ...request.body, userId });
    return response.status(201).json(newSecret);
  } catch (error: any) {
    return response.status(400).json({ message: error });
  }
};

export const find = async (request: Request, response: Response) => {
  try {
    const userId = request.user?._id;

    const secrets = await secretService.find({ userId });

    return response.status(200).json(secrets);
  } catch (error: any) {
    return response.status(400).json({ message: error });
  }
};

export const findById = async (request: Request, response: Response) => {
  try {
    const userId = request.user?._id;

    const secret = await secretService.findOne({
      _id: request.params.id,
      userId,
    });
    return response.status(200).json(secret);
  } catch (error: any) {
    return response.status(400).json({ message: error });
  }
};

export const decryptSecret = async (request: Request, response: Response) => {
  try {
    const decryptedValue = await secretService.decryptSecret({
      _id: request.params.id as string,
      userId: request.user?._id,
      encryptionKey: request.body.encryptionKey,
    });

    return response.status(200).json({ value: decryptedValue });
  } catch (error: any) {
    return response.status(400).json({ message: error });
  }
};
