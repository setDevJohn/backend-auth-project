import { UserMiddleware } from '../middlewares/user';
import { UserController } from './../controllers/user';
import { Router } from 'express';

const userRouter = Router();
const userMiddleware = new UserMiddleware();
const userController = new UserController();

userRouter.post('/',
  userMiddleware.validateCreateFields,
  userMiddleware.create,
  (req, res) => userController.create(req, res)
)

userRouter.get('/:userId',
  (req, res) => userController.getById(req, res)
)

userRouter.post('/sendResetToken',
  userMiddleware.validateEmail,
  (req, res) => userController.sendResetToken(req, res)
)

userRouter.post('/sendConfirmToken',
  userMiddleware.validateEmail,
  (req, res) => userController.sendConfirmToken(req, res)
)

userRouter.post('/confirmToken', 
  userMiddleware.validateEmail,
  userMiddleware.validateToken,
  (req, res) => userController.confirmToken(req, res)
)

userRouter.post('/confirmAccount', 
  userMiddleware.validateToken,
  userMiddleware.confirmAccount,
  (req, res) => userController.confirmAccount(req, res)
)

userRouter.post('/resetPassword',
  userMiddleware.resetPassword,
  (req, res) => userController.resetPassword(req, res)
)

export { userRouter };