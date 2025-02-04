import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../error/errorHandler";
import { AppError, HttpStatus } from "../error/appError";

export class AuthMiddleware {
  public constructor() {
    this.login = this.login.bind(this);
  }

  login (req: Request, res: Response, next: NextFunction) {
    try {
      const { login, pass } = req.body;

      if (!login || !pass) {
        throw new AppError('Login e senha são obrigatórios', HttpStatus.BAD_REQUEST);
      }

      next();
    } catch (err) {
      errorHandler(err as Error, res, )
    }
  }
}