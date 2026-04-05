import { Router } from "express";
import { timeoutMiddleware } from "../middleware/timeout.middleware";
import { create, find } from "../controllers/secret.controller";

const router = Router();

router.get("/", timeoutMiddleware(10), find);
router.post("/", create);

export default router;
