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
import { authLimiter } from "../middleware/rate-limiter.middleware";

const router = Router();

router.post("/signup", authLimiter, validateZod(AuthRequestDto.signup), signup);
router.post("/signin", authLimiter, validateZod(AuthRequestDto.signin), signin);
router.patch(
  "/refresh",
  authLimiter,
  authMiddleware,
  timeoutMiddleware(2),
  refresh,
);
router.get(
  "/generate-password",
  authMiddleware,
  timeoutMiddleware(),
  generatePassword,
);
router.get("/logout", authLimiter, authMiddleware, timeoutMiddleware(), logout);
router.get("/sessions", authMiddleware, timeoutMiddleware(), session);
router.delete(
  "/sessions/:id",
  authLimiter,
  authMiddleware,
  timeoutMiddleware(),
  deleteSession,
);

export default router;
