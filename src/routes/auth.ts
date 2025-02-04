import { AuthMiddleware } from './../middlewares/auth';
import { Router } from "express";
import { AuthController } from "../controllers/auth";

const authRouter = Router();
const authMiddleware = new AuthMiddleware();
const authController = new AuthController();

authRouter.post('/', 
  authMiddleware.login, 
  (req, res) => authController.login(req, res)
);

export { authRouter };