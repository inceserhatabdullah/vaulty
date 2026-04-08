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

export const refresh = async (request: Request, response: Response) => {
  try {
    const { refreshToken } = request.body;

    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refresh({ refreshToken });

    return response
      .status(200)
      .json({ accessToken, refreshToken: newRefreshToken });
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};

export const generatePassword = (request: Request, response: Response) => {
  try {
    const password = authService.generatePassword();
    return response.status(200).json({ password });
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};
