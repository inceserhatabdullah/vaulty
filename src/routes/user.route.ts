import { Router } from "express";
import {
  find,
  changePassword,
} from "../controllers/user.controller";
import { timeoutMiddleware } from "../middleware/timeout.middleware";
import { validateZod } from "../middleware/validate-zod.middleware";
import { AuthRequestDto } from "../dtos/auth.dto";

const router = Router();

router.get("/", timeoutMiddleware(), find);
router.patch("/password", timeoutMiddleware(), validateZod(AuthRequestDto.changePassword), changePassword);

export default router;
