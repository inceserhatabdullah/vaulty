import { Request, Response } from "express";
import { secretService } from "../services/secret.service";

export const create = async (request: Request, response: Response) => {
  try {
    const userId = request.user?._id;

    if (!userId) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const newSecret = await secretService.create({ ...request.body, userId });
    return response.status(201).json(newSecret);
  } catch (error: any) {
    return response.status(500).json({ message: error?.message ?? error });
  }
};
