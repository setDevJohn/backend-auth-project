import { PrismaClient } from "@prisma/client";
import { ICreateUser } from "../interfaces/user";

export class UserModel {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient
  }

  async create (userInfo: ICreateUser) {
    const user = await this.prisma.users.create({
      data: userInfo,
    })

    return user;
  }
}