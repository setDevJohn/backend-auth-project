export interface ICreateUserResquest {
  name: string,
  email: string,
  pass: string,
  companyName: string,
  tradingName: string,
  cnpj: string,
}
export interface IUpdateUserRequest {
  verified?: boolean
  pass?: string
  last_login?: Date
  locked_until?: Date | null
  failed_attempts?: number | { increment: number }
  password_reset_token?: string | null
  account_verification_token?: string | null
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
