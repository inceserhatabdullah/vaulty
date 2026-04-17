import { Router } from "express";
import { timeoutMiddleware } from "../middleware/timeout.middleware";
import {
  _delete,
  create,
  decrypt,
  find,
  update,
} from "../controllers/secret.controller";
import { validateZod } from "../middleware/validate-zod.middleware";
import { requestHeaderMiddleware } from "../middleware/request-header.middleware";
import { requestHeader } from "../constants/request-header.constant";
import { SecretRequestDto } from "../dtos/secret.dto";

const router = Router();

router.get("/", timeoutMiddleware(), find);
router.get(
  "/decrypt/:id",
  requestHeaderMiddleware(requestHeader.vaultPin),
  timeoutMiddleware(),
  decrypt,
);
router.post("/", validateZod(SecretRequestDto.create), create);
router.patch("/:id", validateZod(SecretRequestDto.update), update);
router.delete("/:id", timeoutMiddleware(), _delete);

export default router;
