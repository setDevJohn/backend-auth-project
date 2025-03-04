import { Response } from "express";

export class ResponseHandler {
  public success(res: Response, statusCode: number, data: any, message: string) {
    res.status(statusCode).json({ 
      status: statusCode,
      message,
      resource: data,
    });
  }
}
