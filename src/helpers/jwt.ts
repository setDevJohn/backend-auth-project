import jwt from "jsonwebtoken";
import { AppError, HttpStatus } from "../error/appError";
import { ITokenData } from "../interfaces/token";

const SECRET_KEY = process.env.SECRET_KEY;

export function generateToken(user: ITokenData): string {
   if (!SECRET_KEY) {
    throw new AppError(
      "JWT_SECRET environment variable not set.",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  } 
  return jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });
}

export function verifyToken(token: string): any {
  try {
    if (!SECRET_KEY) {
      throw new AppError(
        "JWT_SECRET environment variable not set.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}
