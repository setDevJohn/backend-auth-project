import { Router } from "express";
import { authRouter } from "./auth";
import { userRouter } from "./user";

const routes = Router();

// Fazer verificação de token nas rotas
// Pegar o company e passar no res.locals
// Atualizar models com company

routes.use('/auth', authRouter);
routes.use('/user', userRouter);

export { routes };