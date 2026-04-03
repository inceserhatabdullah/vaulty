import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";

const userRepository = new UserRepository();

export const signup = async (request: Request, response: Response) => {
  try {
    const { username, password } = request.body;
    const user = await userRepository.findOne({ username });

    if (user) {
      return response.status(400).json({ message: "User already exists." });
    }

    const newUser = await userRepository.create({ username, password });
    return response.status(201).json(newUser);
  } catch (error: any) {
    return response.status(500).json({ message: error?.message ?? error });
  }
};
