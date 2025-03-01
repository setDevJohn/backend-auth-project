import { PrismaClient } from "@prisma/client";
import { ICreateUser, IUpdateUserRequest } from "../interfaces/user";

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

  async findAll ({id, email}: {id?: number, email?: string}) {
    return await this.prisma.users.findMany({
      where: {
        ...(id && {id}),
        ...(email && {email}),
        deleted_at: null,
      },
      select: {
        active: true,
        companyId: true,
        created_at: true,
        email: true,
        id: true,
        name: true,
        password_reset_token: true,
        account_verification_token: true,
        role: true,
        updated_at: true,
        verified: true,
      }
    })
  }

  async update(id: number, data: IUpdateUserRequest) {
   return await this.prisma.users.update({
      where: { id },
      data
   }) 
  }
}