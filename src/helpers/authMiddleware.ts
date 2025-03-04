import { Request, Response, NextFunction } from "express";
import { AppError, HttpStatus } from "../error/appError";
import { verifyToken } from "../helpers/jwt";
import { errorHandler } from "../error/errorHandler";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Token não fornecido.", HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      throw new AppError("Token inválido ou expirado. Faça login novamente", HttpStatus.UNAUTHORIZED);
    }

    res.locals.user = decoded;
    next();
  } catch (err) {
    errorHandler(err as Error, res)
  }
}
