import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const signup = async (request: Request, response: Response) => {
  try {
    const { accessToken, refreshToken } = await authService.signup(request);
    authService.setRefreshTokenCookie(response, refreshToken);
    return response.status(201).json({ accessToken });
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};

export const signin = async (request: Request, response: Response) => {
  try {
    const { accessToken, refreshToken } = await authService.signin(request);
    authService.setRefreshTokenCookie(response, refreshToken);

    return response.status(200).json({ accessToken });
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};

export const refresh = async (request: Request, response: Response) => {
  try {
    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refresh(request, response);
    authService.setRefreshTokenCookie(response, newRefreshToken);

    return response.status(200).json({ accessToken });
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

export const logout = async (request: Request, response: Response) => {
  try {
    await authService.logout(request, response);
    return response.status(204).send();
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};
