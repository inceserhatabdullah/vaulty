import { Router } from "express";
import secretRouter from "./secret.route";

const apiRouter = Router();

apiRouter.use("secrets", secretRouter);

export default apiRouter;
