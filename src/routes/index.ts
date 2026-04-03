import { Router } from "express";
import secretRouter from "./secret.route";
import authRouter from "./auth.route";

const apiRouter = Router();

apiRouter.use("/secrets", secretRouter);
apiRouter.use("/auth", authRouter);

export default apiRouter;
