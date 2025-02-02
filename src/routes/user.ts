import { UserMiddleware } from '../middlewares/user';
import { UserController } from './../controllers/user';
import { Router } from 'express';

const userRouter = Router();
const userMiddleware = new UserMiddleware();
const userController = new UserController();

userRouter.post('/',
  userMiddleware.validateCreateFields,
  userMiddleware.createUser,
  (req, res) => userController.create(req, res)
)

export { userRouter };