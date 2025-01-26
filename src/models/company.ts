import { Prisma, PrismaClient } from "@prisma/client";
import { ICreateCompany } from "../interfaces/company";

export class CompanyModel {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(companyInfo: ICreateCompany) {
    try {
      const { companyName, tradingName, cnpj } = companyInfo

      const company = await this.prisma.companies.create({
        data: {
          name: companyName,
          trading_name: tradingName,
          cnpj,
        },
      })

      return company
    } catch (err) {
      console.error('Error creating company:', err)
      throw err;
    }
  }
}