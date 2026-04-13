import { Request, Response } from "express";
import { userRepository } from "../repositories/user.repository";
import { EncryptionService } from "../services/encryption.service";
import { authService } from "../services/auth.service";
import { identityContext } from "../functions/identity-context.function";
import { JwtService } from "../services/jwt.service";
import { JwtTypeValue } from "../types/jwt.type";

export const find = async (request: Request, response: Response) => {
  try {
    const context = identityContext(request);
    const decoded = JwtService.verify(
      context.accessToken,
      JwtTypeValue.access_token,
    );
    const userData = await userRepository.findOne({ _id: decoded.user._id });

    return response.status(200).json(userData);
  } catch (error: any) {
    return response.status(400).json({ error: error.message });
  }
};

export const changePassword = async (request: Request, response: Response) => {
  try {
    const context = identityContext(request);
    const decoded = JwtService.verify(
      context.accessToken,
      JwtTypeValue.access_token,
    );

    const { password } = request.body;

    const newPassword = await EncryptionService.hash(password);

    await userRepository.update(
      { _id: decoded.user._id },
      { password: newPassword },
    );

    await authService.logout(context, true);
    authService.clearCookie(response);

    return response.status(200).json({
      message:
        "Your password has been changed. To ensure your account's safety, we’ve logged you out of all devices. Please sign in with your new password.",
    });
  } catch (error: any) {
    return response.status(400).json({ error: error.message });
  }
};
