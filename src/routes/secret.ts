import { Router, Request, Response } from "express";
import { timeoutMiddleware } from "../middleware/timeout";

const router = Router();

router.get(
  "/",
  timeoutMiddleware(15),
  (request: Request, response: Response) => {},
);

router.get("/:id", (request: Request, response: Response) => {});

export default router;
