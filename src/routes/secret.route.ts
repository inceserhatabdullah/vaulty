import { Router } from "express";
import { timeoutMiddleware } from "../middleware/timeout.middleware";
import { create, find, findById } from "../controllers/secret.controller";

const router = Router();

router.get("/", timeoutMiddleware(10), find);
router.get("/:id", timeoutMiddleware(10), findById);
router.post("/", create);

export default router;
