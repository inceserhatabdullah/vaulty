import { Router } from "express";
import { timeoutMiddleware } from "../middleware/timeout.middleware";
import {
  create,
  decryptSecret,
  find,
  findById,
} from "../controllers/secret.controller";
import { validateZod } from "../middleware/validate-zod.middleware";
import { decryptSecretRequestDto } from "../dtos/decrypt-secret.request.dto";

const router = Router();

router.get("/", timeoutMiddleware(5), find);
router.get("/:id", timeoutMiddleware(2), findById);
router.get(
  "/decrypt/:id",
  validateZod(decryptSecretRequestDto),
  timeoutMiddleware(2),
  decryptSecret,
);
router.post("/", create);

export default router;
