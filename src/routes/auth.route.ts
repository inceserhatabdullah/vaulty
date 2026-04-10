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
import { verifyTokenMiddleware } from "../middleware/verify-token.middleware";

const router = Router();

router.post("/signup", validateZod(signupRequestDto), signup);
router.post("/signin", validateZod(signinRequestDto), signin);
router.patch("/refresh", verifyTokenMiddleware, timeoutMiddleware(2), refresh);
router.get(
  "/generate-password",
  verifyTokenMiddleware,
  timeoutMiddleware(1),
  generatePassword,
);
router.get("/logout", verifyTokenMiddleware, timeoutMiddleware(2), logout);

export default router;
