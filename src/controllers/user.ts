import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import { ResponseHandler } from '../helpers/responseHandler';
import { errorHandler } from '../error/errorHandler';
import { AppError, HttpStatus } from '../error/appError';
import bcrypt from "bcrypt";

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
      
      this.responseHandler.success(res, 201, user, 'Usário criado com sucesso')
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }
}