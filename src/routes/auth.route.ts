import { Router } from "express";
import { signup, signin, refresh } from "../controllers/auth.controller";
import { validateZod } from "../middleware/validate-zod.middleware";
import { refreshTokenRequestDto } from "../dtos/refresh-token.request.dto";
import { timeoutMiddleware } from "../middleware/timeout.middleware";
import { signupRequestDto } from "../dtos/signup.request.dto";
import { signinRequestDto } from "../dtos/signin.request.dto";

const router = Router();

router.post("/signup", validateZod(signupRequestDto), signup);
router.post("/signin", validateZod(signinRequestDto), signin);
router.patch(
  "/refresh",
  validateZod(refreshTokenRequestDto),
  timeoutMiddleware(2),
  refresh,
);

export default router;
