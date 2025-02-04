import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { AuthModel } from "../models/auth";
import { errorHandler } from "../error/errorHandler";
import { AppError, HttpStatus } from "../error/appError";
import { ResponseHandler } from '../helpers/responseHandler';

export class AuthController {
  private authModel: AuthModel;
  private responseHandler: ResponseHandler;

  constructor() {
    this.authModel = new AuthModel();
    this.responseHandler = new ResponseHandler();
  }

  async login(req: Request, res: Response) {
    try {
      const { login, pass } = req.body;

      const user = await this.authModel.login(login)
      console.log(user)
      if (!user) {
        throw new AppError('Usuário ou senha inválidos', HttpStatus.UNAUTHORIZED);
      }
      if (!user?.active) {
        throw new AppError('Usuário inativo', HttpStatus.FORBIDDEN);
      }
      if (!user?.companies.active) {
        throw new AppError('Empresa inativa', HttpStatus.FORBIDDEN);
      }

      // TODO: Verificar as tentativar erradas e fazer a iteraçãona váriável
      // TODO: Alterar o tempo de login após o erro e mostar até quando vai ficar bloqueado
      // TODO> Bloquear o login se o usuáio estiver com cbloqueio temporário
      // TODO: Salvar a data e o tempo de login do usuário
      // TODO: Criar um token com o login e o tempo de expiração para autenticar o usuário na próxima requisição
      // TODO: Enviar um email para confirmação de senha com expiração
      // TODO: Criar campo para token de confirmação de conta e campo para conta verificada 
      // TODO: Veririficar se cumpriu os requisitos para oo login 
      // TODO: Refatorar
      console.log(pass)
      const passCompare = await bcrypt.compare(pass, user.pass)

      if (!passCompare) {
        throw new AppError('Usuário ou senha inválidos', HttpStatus.UNAUTHORIZED);
      }

      this.responseHandler.success(res, 200, user, 'Autenticação bem sucedida')
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }
}