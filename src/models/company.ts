import { Prisma, PrismaClient } from "@prisma/client";
import { ICreateCompany } from "../interfaces/company";

export class CompanyModel {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll({cnpj, name}: {cnpj?: string, name?: string}) {
    return await this.prisma.companies.findMany({
      where: {
        ...(cnpj && { cnpj }),
        ...(name && { name })
      }
    })
  }
}