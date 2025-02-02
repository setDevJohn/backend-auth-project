import { Router } from "express";
import { AuthController } from "../controllers/auth";

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/',
  (req, res) => authController.login(req, res)
);

export { authRouter };