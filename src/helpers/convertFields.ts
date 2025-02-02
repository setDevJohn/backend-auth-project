function cnpjToString(cnpj: string): string {
  return cnpj.replace(/\D/g, ''); 
}

export const convert = { cnpjToString } 