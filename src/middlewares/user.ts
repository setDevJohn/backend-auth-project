import { NextFunction, Request, Response } from "express";
import { AppError, HttpStatus } from '../error/appError';
import { CompanyModel } from './../models/company';
import { UserModel } from './../models/user';
import { errorHandler } from "../error/errorHandler";
import { convert } from "../helpers/convertFields";
import { validate } from "../helpers/validateFields";

export class UserMiddleware {
  private userModel: UserModel;
  private companyModel: CompanyModel;

  constructor() {
    this.userModel = new UserModel()
    this.companyModel = new CompanyModel()
    this.validateCreateFields = this.validateCreateFields.bind(this);
    this.create = this.create.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.confirmAccount = this.confirmAccount.bind(this);
    this.validateToken = this.validateToken.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  async validateCreateFields(req: Request, res: Response, next: NextFunction){
    const requiredFields = [
      'name',
      'email',
      'pass',
      'companyName',
      'tradingName',
      'cnpj',
    ]
    try {
      for (const field of requiredFields) {
        if (!req.body[field]) {
          throw new AppError(`O campo ${field} é obrigatório`, HttpStatus.BAD_REQUEST)
        }
      }

      const cnpjVerified = validate.cnpj(req.body.cnpj)
      if (!cnpjVerified) {
        throw new AppError('CNPJ inválido', HttpStatus.BAD_REQUEST)
      }
      const formattedCnpj = convert.cnpjToString(req.body.cnpj)
      req.body.cnpj = formattedCnpj;

      const emailVerified = validate.email(req.body.email)
      if (!emailVerified) {
        throw new AppError('Email inválido', HttpStatus.BAD_REQUEST)
      }

      next()
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, cnpj, companyName } = req.body;

      const [emailResponse] = await this.userModel.findAll({ email: email });
      if (emailResponse) {
        throw new AppError('Email já cadastrado', HttpStatus.BAD_REQUEST)
      }

      const [cnpjResponse] = await this.companyModel.findAll({ cnpj: cnpj });
      if (cnpjResponse) {
        throw new AppError('CNPJ já cadastrado', HttpStatus.BAD_REQUEST)
      }

      const [nameResponse] = await this.companyModel.findAll({ name: companyName });
      if (nameResponse) {
        throw new AppError('Razão social já cadastrada', HttpStatus.BAD_REQUEST)
      }

      next()
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }

  async validateEmail(req: Request, res: Response, next: NextFunction){
    try {
      const { email } = req.body

      if (!email) throw new AppError('Email é obrigatório', HttpStatus.BAD_REQUEST) 

      const emailVerified = validate.email(email)
      if (!emailVerified) {
        throw new AppError('Email inválido', HttpStatus.BAD_REQUEST)
      }

      next()
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }

  async confirmAccount(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.body

      if (!id) throw new AppError('Id do usuário é obrigatório', HttpStatus.BAD_REQUEST) 

      next()
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }

  async validateToken(req: Request, res: Response, next: NextFunction){
    try {
      const { token } = req.body
      if (!token) {
        throw new AppError('Token é obrigatório', HttpStatus.BAD_REQUEST) 
      }

      if (String(token).length !== 11) {
        throw new AppError('Formato de token inválido', HttpStatus.BAD_REQUEST)
      }

      next()
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction){
    try {
      const { id, password } = req.body
      if (!id) {
        throw new AppError('Id do usuário é obrigatório', HttpStatus.BAD_REQUEST) 
      }

      if (!password) {
        throw new AppError('Nova senha é obrigatório', HttpStatus.BAD_REQUEST)
      }

      next()
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }
}