export interface ICreateUserResquest {
  name: string,
  email: string,
  pass: string,
  companyName: string,
  tradingName: string,
  cnpj: string,
}

export interface ICreateUser {
  name: string,
  email: string,
  pass: string,
  company_id: number
}
