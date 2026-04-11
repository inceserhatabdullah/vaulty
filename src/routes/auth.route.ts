import { Router } from "express";
import {
  signup,
  signin,
  refresh,
  generatePassword,
  logout,
} from "../controllers/auth.controller";
import { validateZod } from "../middleware/validate-zod.middleware";
import { timeoutMiddleware } from "../middleware/timeout.middleware";
import { signupRequestDto } from "../dtos/signup.request.dto";
import { signinRequestDto } from "../dtos/signin.request.dto";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", validateZod(signupRequestDto), signup);
router.post("/signin", validateZod(signinRequestDto), signin);
router.patch("/refresh", authMiddleware, timeoutMiddleware(2), refresh);
router.get(
  "/generate-password",
  authMiddleware,
  timeoutMiddleware(),
  generatePassword,
);
router.get("/logout", authMiddleware, timeoutMiddleware(), logout);

export default router;
