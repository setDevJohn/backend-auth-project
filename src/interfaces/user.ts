export interface ICreateUserResquest {
  name: string,
  email: string,
  pass: string,
  companyName: string,
  tradingName: string,
  cnpj: string,
}
export interface IUpdateUserRequest {
  locked_until?: Date | null
  last_login?: Date
  failed_attempts?: number | { increment: number }
}

export interface ICreateUser {
  company: {
    companyName: string
    tradingName: string
    cnpj: string
  };
  user: {
    name: string
    email: string
    pass: string
  }
}
