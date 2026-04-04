import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const signup = async (request: Request, response: Response) => {
  try {
    const { newToken } = await authService.signup(request.body);
    return response.status(201).json({ token: newToken.token });
  } catch (error: any) {
    return response.status(500).json({ message: error?.message ?? error });
  }
};

export const signin = async (request: Request, response: Response) => {
  try {
    const { newToken } = await authService.signin(request.body);
    return response.status(200).json({ token: newToken.token });
  } catch (error: any) {
    return response.status(500).json({ message: error?.message ?? error });
  }
};
