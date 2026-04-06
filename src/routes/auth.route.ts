import { Router } from "express";
import { signup, signin, refresh } from "../controllers/auth.controller";
import { validateZod } from "../middleware/validate-zod.middleware";
import { refreshTokenRequestDto } from "../dtos/refresh-token.request.dto";
import { timeoutMiddleware } from "../middleware/timeout.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.patch(
  "/refresh",
  validateZod(refreshTokenRequestDto),
  timeoutMiddleware(2),
  refresh,
);

export default router;
