import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const signup = async (request: Request, response: Response) => {
  try {
    const { accessToken, refreshToken } = await authService.signup(
      request.body,
    );
    return response.status(201).json({ accessToken, refreshToken });
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};

export const signin = async (request: Request, response: Response) => {
  try {
    const { accessToken, refreshToken } = await authService.signin(
      request.body,
    );
    return response.status(200).json({ accessToken, refreshToken });
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};
