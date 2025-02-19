import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { AuthModel } from "../models/auth";
import { UserModel } from '../models/user';
import { errorHandler } from "../error/errorHandler";
import { AppError, HttpStatus } from "../error/appError";
import { ResponseHandler } from '../helpers/responseHandler';
import { generateToken } from '../helpers/jwt';

export class AuthController {
  private authModel: AuthModel;
  private userModel: UserModel;
  private responseHandler: ResponseHandler;

  constructor() {
    this.authModel = new AuthModel();
    this.userModel = new UserModel();
    this.responseHandler = new ResponseHandler();
  }

  async login(req: Request, res: Response) {
    try {
      const { login, pass } = req.body;

      const user = await this.authModel.login(login)

      if (!user) {
        throw new AppError('Usuário ou senha inválidos', HttpStatus.UNAUTHORIZED);
      }
      if (!user.active) {
        throw new AppError('Usuário inativo', HttpStatus.FORBIDDEN);
      }
      if (!user.companies.active) {
        throw new AppError('Empresa inativa', HttpStatus.FORBIDDEN);
      }
      if (user.failed_attempts  && user.failed_attempts>= 10) {
        throw new AppError('Conta bloqueada por excesso de tentativas, redefina sua senha' , HttpStatus.FORBIDDEN);
      }
      if (user.locked_until) {
        const now = new Date();
        const lockedUntil = new Date(user.locked_until);
        
        if (now < lockedUntil) {
          const diffMs = lockedUntil.getTime() - now.getTime();
          const diffMinutes = Math.ceil(diffMs / 60000);
          
          throw new AppError(
            `Muitas tentativas de login realizadas. Tente novamente em ${diffMinutes} minuto(s).`,
            HttpStatus.FORBIDDEN
          );
        }
      }
      
      let lockTime = 0;
      if (user.failed_attempts === 3) lockTime = 2; // 2 minutos
      if (user.failed_attempts === 7) lockTime = 4; // 4 minutos
    
      if (lockTime) {
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + lockTime);
        await this.userModel.updateLockedTime(user.id, lockUntil);
      }

      // TODO: Atualizar token com tempo de expiração para
      // TODO: Enviar um email para confirmação de senha com expiração
      const passCompare = await bcrypt.compare(pass, user.pass)

      if (!passCompare) {
        await this.userModel.updateFailedAttempts(user.id)
        throw new AppError('Usuário ou senha inválidos', HttpStatus.UNAUTHORIZED);
      }

      const tokenData = {
        companyId: user.companyId,
        userId: user.id,
        role: user.role,
        verified: user.verified ?? false
      }

      const token = generateToken(tokenData)
      // Remover bloqueios
      // gravar horarip de login
      this.responseHandler.success(res, 200, token, 'Autenticação bem sucedida')
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }
}