import { Router } from "express";
import { timeoutMiddleware } from "../middleware/timeout.middleware";
import { create } from "../controllers/secret.controller";

const router = Router();

router.post("/", timeoutMiddleware(15), create);

export default router;
