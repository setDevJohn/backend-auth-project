export interface ICreateUserResquest {
  name: string,
  email: string,
  pass: string,
  companyName: string,
  tradingName: string,
  cnpj: string,
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
