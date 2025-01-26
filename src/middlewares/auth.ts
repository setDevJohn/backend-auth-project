export class AuthMiddleware {
  constructor() {
    this.validateFields = this.validateFields.bind(this);
  }

  validateFields(req, res, next) {
    next();
  }
}