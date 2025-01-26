import { Router } from "express";
import { AuthController } from "../controllers/auth";
import { AuthMiddleware } from "../middlewares/auth";

const authRouter = Router();
const authMiddleware = new AuthMiddleware();
const authController = new AuthController();

authRouter.post('/',
  authMiddleware.validateFields,
  (req, res) => authController.login(req, res)
);

export { authRouter };