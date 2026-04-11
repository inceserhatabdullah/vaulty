import { Router } from "express";
import {
  find,
  changePassword,
} from "../controllers/user.controller";
import { timeoutMiddleware } from "../middleware/timeout.middleware";
import { validateZod } from "../middleware/validate-zod.middleware";
import { userChangePasswordRequestDto } from "../dtos/user-change-password.request.dto";

const router = Router();

router.get("/", timeoutMiddleware(), find);
router.patch("/password", timeoutMiddleware(), validateZod(userChangePasswordRequestDto), changePassword);

export default router;
