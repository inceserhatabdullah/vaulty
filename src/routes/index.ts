import { Router } from "express";
import secretRouter from "./secret.route";
import authRouter from "./auth.route";
import { verifyTokenMiddleware } from "../middleware/verify-token.middleware";
import { parseUserAgentMiddleware } from "../middleware/session.middleware";

const apiRouter = Router();

/* public routes */
apiRouter.use(parseUserAgentMiddleware);
apiRouter.use("/auth", authRouter);

/* use verify token middleware for private routes */
apiRouter.use(verifyTokenMiddleware);

/* private routes */
apiRouter.use("/secrets", secretRouter);

export default apiRouter;
