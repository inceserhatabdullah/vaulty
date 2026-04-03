import { Router } from "express";
import { timeoutMiddleware } from "../middleware/timeout.middleware";
import type { Request, Response } from "express";

const router = Router();

router.get(
  "/",
  timeoutMiddleware(15),
  (request: Request, response: Response) => {},
);

router.get("/:id", (request: Request, response: Response) => {});

export default router;
