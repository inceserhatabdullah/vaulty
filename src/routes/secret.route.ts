import { Router } from "express";
import { timeoutMiddleware } from "../middleware/timeout.middleware";
import {
  create,
  decrypt,
  find,
} from "../controllers/secret.controller";
import { validateZod } from "../middleware/validate-zod.middleware";
import { createSecretRequestDto } from "../dtos/create-secret.request.dto";
import { requestHeaderMiddleware } from "../middleware/request-header.middleware";
import { requestHeader } from "../constants/request-header.constant";

const router = Router();

router.get("/", timeoutMiddleware(5), find);
router.get(
  "/decrypt/:id",
  requestHeaderMiddleware(requestHeader.vaultPin),
  timeoutMiddleware(2),
  decrypt,
);
router.post("/", validateZod(createSecretRequestDto), create);

export default router;
