import { PrismaClient } from "@prisma/client";

export class AuthModel {
  private prisma: PrismaClient;

  constructor () {
    this.prisma = new PrismaClient();
  }

  async login(login: string) {
    return await this.prisma.users.findFirst({
      where: { 
        email: login,
        deleted_at: null,
        companies: {
          deleted_at: null  
        }
      },
      include: {
        companies: true,
      }
    })
  }
}