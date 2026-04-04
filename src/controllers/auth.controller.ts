import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const signup = async (request: Request, response: Response) => {
  try {
    const { newUser, newToken } = await authService.signup(request.body);
    return response
      .status(201)
      .json({ username: newUser.username, token: newToken.token });
  } catch (error: any) {
    return response.status(500).json({ message: error?.message ?? error });
  }
};

export const signin = async (request: Request, response: Response) => {
  try {
    const { user, newToken } = await authService.signin(request.body);
    return response
      .status(200)
      .json({ username: user.username, token: newToken.token });
  } catch (error: any) {
    return response.status(500).json({ message: error?.message ?? error });
  }
};
