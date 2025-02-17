import jwt from "jsonwebtoken";
import { AppError, HttpStatus } from "../error/appError";

const SECRET_KEY = process.env.JWT_SECRET || "seu_segredo_super_seguro";

export function generateToken(user: any): string {
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
