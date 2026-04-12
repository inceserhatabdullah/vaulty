import { Router } from "express";
import {
  signup,
  signin,
  refresh,
  generatePassword,
  logout,
  session,
  deleteSession,
} from "../controllers/auth.controller";
import { validateZod } from "../middleware/validate-zod.middleware";
import { timeoutMiddleware } from "../middleware/timeout.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { AuthRequestDto } from "../dtos/auth.dto";

const router = Router();

router.post("/signup", validateZod(AuthRequestDto.signup), signup);
router.post("/signin", validateZod(AuthRequestDto.signin), signin);
router.patch("/refresh", authMiddleware, timeoutMiddleware(2), refresh);
router.get(
  "/generate-password",
  authMiddleware,
  timeoutMiddleware(),
  generatePassword,
);
router.get("/logout", authMiddleware, timeoutMiddleware(), logout);
router.get("/sessions", authMiddleware, timeoutMiddleware(), session);
router.delete(
  "/sessions/:id",
  authMiddleware,
  timeoutMiddleware(),
  deleteSession,
);

export default router;
