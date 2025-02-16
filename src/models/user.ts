import { PrismaClient } from "@prisma/client";
import { ICreateUser } from "../interfaces/user";

export class UserModel {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient
  }

  async create ({company, user}: ICreateUser) {
    return await this.prisma.$transaction(async (transaction) => {
      const companyResult = await transaction.companies.create({
        data: {
          name: company.companyName,
          tradingName: company.tradingName,
          cnpj: company.cnpj,
        }
      })

      return await transaction.users.create({
        data: {
          ...user,
          companyId: companyResult.id,
        },
      })
    })
  }

  async findAll ({email}: {email?: string}) {
    return await this.prisma.users.findMany({
      where: {
        ...(email && {email}),
      },
    })
  }

  //Trocar as atualizações por uma rota só 

  async updateLockedTime (user_id: number, locked_until: Date) {
    return await this.prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        locked_until
      },
    })
  }

  async updateFailedAttempts (user_id: number) {
    return await this.prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        failed_attempts: {
          increment: 1
        },
      },
    })
  }

  async updateLastLogin (user_id: number) {
    return await this.prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        last_login: new Date(),
      },
    })
  }
}