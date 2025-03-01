import { Request, Response } from 'express';
import bcrypt from "bcrypt";
import { UserModel } from '../models/user';
import { errorHandler } from '../error/errorHandler';
import { AppError, HttpStatus } from '../error/appError';
import { generateRandonToken } from '../helpers/generateToken';
import { ResponseHandler } from '../helpers/responseHandler';
import { sendEmail } from '../helpers/nodemailer';
import { generateToken } from '../helpers/jwt';

export class UserController {
  private userModel: UserModel
  public responseHandler: ResponseHandler

  constructor() {
    this.responseHandler = new ResponseHandler();
    this.userModel = new UserModel();
  }

  async create (req: Request, res: Response) {
    try {
      const data = req.body;
  
      const SALT_ROUNDS = 10;
      const hashedPassword = await bcrypt.hash(data.pass, SALT_ROUNDS);

      const user = await this.userModel.create({
        company: {
          companyName: data.companyName,
          tradingName: data.tradingName,
          cnpj: data.cnpj
        },
        user: {
          name: data.name,
          email: data.email,
          pass: hashedPassword,
        }
      });

      const confirmToken = generateRandonToken()
      await this.userModel.update(user.id, { account_verification_token: confirmToken})

      const subject = 'Confirmação de conta';
      const content = `Utilize o código de confirmação para ativar sua conta`

      await sendEmail(data.email, subject, content)
      
      this.responseHandler.success(res, 201, user, 'Usário criado com sucesso')
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { userId } = req.params

      const [user] = await this.userModel.findAll({id: +userId})

      this.responseHandler.success(res, 200, user, 'Usuário listado com sucesso')
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }

  async sendResetToken (req: Request, res: Response) {
    try {
      const { email } = req.body;
      
      const [user] = await this.userModel.findAll({ email });
      if (!user) throw new AppError('Email inválido', HttpStatus.NOT_FOUND)

      const resetToken = generateRandonToken()
      await this.userModel.update(user.id, { password_reset_token: resetToken})

      const subject = 'Redefinição de senha';
      const content = `Utilize o código de recuperação para redefinir sua senha`

      await sendEmail(email, subject, content)

      this.responseHandler.success(res, 201, user, 'Token enviado com sucesso')
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }

  async confirmToken (req: Request, res: Response) {
    try {
      const { token, email } = req.body;
      
      const [user] = await this.userModel.findAll({ email });
      if (!user) throw new AppError('Email inválido', HttpStatus.NOT_FOUND)

      if (token !== user.password_reset_token) {
        throw new AppError('Token inválido', HttpStatus.BAD_REQUEST)
      }

      this.responseHandler.success(res, 201, {user, token}, 'Token confirmado com sucesso')
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }

  async confirmAccount (req: Request, res: Response) {
    try {
      const { token, id } = req.body;
      
      const [user] = await this.userModel.findAll({ id: +id });
      if (!user) throw new AppError('Usuário não encontrado', HttpStatus.NOT_FOUND)

      if (token !== user.account_verification_token) {
        throw new AppError('Token inválido', HttpStatus.BAD_REQUEST)
      }

      await this.userModel.update(id, { account_verification_token: null, verified: true })

      const tokenData = {
        companyId: user.companyId,
        userId: user.id,
        role: user.role,
        verified: true,
        email: user.email
      }
      const userToken = generateToken(tokenData)

      this.responseHandler.success(res, 201, userToken, 'Conta verificada com sucesso')
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }

  async resetPassword (req: Request, res: Response) {
    try {
      const { id, password } = req.body;

      const [user] = await this.userModel.findAll({ id })
      if (!user) throw new AppError('Usuário não encontrado', HttpStatus.NOT_FOUND)

      const SALT_ROUNDS = 10;
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const updatedUser = await this.userModel.update(id, 
        {
          pass: hashedPassword,
          password_reset_token: null
        }
      )

      this.responseHandler.success(res, 201, updatedUser, 'Token enviado com sucesso')
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }

  async sendConfirmToken (req: Request, res: Response) {
    try {
      const { email } = req.body;
      
      const [user] = await this.userModel.findAll({ email: email });
      if (!user) throw new AppError('Email inválido', HttpStatus.NOT_FOUND)

      const confirmToken = generateRandonToken()
      await this.userModel.update(user.id, { account_verification_token: confirmToken})

      const subject = 'Confirmação de conta';
      const content = `Utilize o código de confirmação para ativar sua conta`

      await sendEmail(email, subject, content)

      this.responseHandler.success(res, 201, user, 'Token enviado com sucesso')
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }
}