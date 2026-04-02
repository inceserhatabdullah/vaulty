import { Router } from "express";
import secretRouter from "./secret";

const apiRouter = Router();

apiRouter.use("secrets", secretRouter);

export default apiRouter;
