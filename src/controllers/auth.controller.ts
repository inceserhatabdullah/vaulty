import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { sessionService } from "../services/session.service";
import { identityContext } from "../functions/identity-context.function";
import { JwtService } from "../services/jwt.service";
import { JwtTypeValue } from "../types/jwt.type";

export const signup = async (request: Request, response: Response) => {
  try {
    const context = identityContext(request);

    const { accessToken, refreshToken } = await authService.signup(
      request.body,
      context,
    );

    authService.setRefreshTokenCookie(response, refreshToken);
    return response.status(201).json({ accessToken });
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};

export const signin = async (request: Request, response: Response) => {
  try {
    const context = identityContext(request);

    const { accessToken, refreshToken } = await authService.signin(
      request.body,
      context,
    );

    authService.setRefreshTokenCookie(response, refreshToken);

    return response.status(200).json({ accessToken });
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};

export const refresh = async (request: Request, response: Response) => {
  try {
    const context = identityContext(request);

    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refresh(request.cookies, context);
    authService.clearCookie(response);

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
    const context = identityContext(request);
    const clearAll = request.query?.all === "true";

    await authService.logout(context, clearAll);

    authService.clearCookie(response);

    return response.status(204).send();
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};

export const session = async (request: Request, response: Response) => {
  try {
    const context = identityContext(request);

    const decoded = JwtService.verify(
      context.accessToken,
      JwtTypeValue.access_token,
    );

    const sessions = await sessionService.find({ userId: decoded.user._id });

    return response.status(200).json(sessions);
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};

export const deleteSession = async (request: Request, response: Response) => {
  try {
    const { id: _id } = request.params;
    const context = identityContext(request);

    const decoded = JwtService.verify(
      context.accessToken,
      JwtTypeValue.access_token,
    );

    await sessionService.softDelete({ _id, userId: decoded.user._id });

    return response.status(204).send();
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};
