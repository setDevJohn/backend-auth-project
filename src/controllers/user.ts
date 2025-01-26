import { ICreateUserResquest } from '../interfaces/user';
import { CompanyModel } from '../models/company';
import { UserModel } from '../models/user';

export class UserController {
  private userModel: UserModel
  private companyModel: CompanyModel

  constructor() {
    this.userModel = new UserModel();
    this.companyModel = new CompanyModel();
  }

  async create (req: Request, res: Response) {
    const { 
      name,
      email,
      pass,
      companyName,
      tradingName,
      cnpj
    } = req.body as ICreateUserResquest;
  
    try {
      
    
      const company = await this.companyModel.create({
        companyName,
        tradingName,
        cnpj
      })
      console.log('company', company);

      const user = await this.userModel.create({
        name,
        email,
        pass,
        company_id: company.id,
      });

      console.log('user', user);

      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ message: 'Error creating user' });
    }
  }
}