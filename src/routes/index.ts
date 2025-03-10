import { Router } from "express";
import { authRouter } from "./auth";
import { userRouter } from "./user";

const routes = Router();

routes.use('/auth', authRouter);
routes.use('/user', userRouter);

export { routes };