export class AuthController {
  constructor() {
  }

  async login(req: Request, res: Response) {
    res.status(200).json({ message: 'Logged in successfully' });
  }
}