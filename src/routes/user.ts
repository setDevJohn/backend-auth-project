import { UserController } from './../controllers/user';
import { Router } from 'express';

const userRouter = Router();
const userController = new UserController();

userRouter.post('/',
  (req, res) => userController.create(req, res)
)

export { userRouter };