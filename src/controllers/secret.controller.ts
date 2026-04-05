import { Request, Response } from "express";
import { secretService } from "../services/secret.service";

export const create = async (request: Request, response: Response) => {
  try {
    const userId = request.user?._id;

    const newSecret = await secretService.create({ ...request.body, userId });
    return response.status(201).json(newSecret);
  } catch (error: any) {
    return response.status(500).json({ message: error });
  }
};

export const find = async (request: Request, response: Response) => {
  try {
    const userId = request.user?._id;

    const secrets = await secretService.find({ userId });

    return response.status(200).json(secrets);
  } catch (error: any) {
    return response.status(500).json({ message: error });
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
    return response.status(500).json({ message: error });
  }
};
