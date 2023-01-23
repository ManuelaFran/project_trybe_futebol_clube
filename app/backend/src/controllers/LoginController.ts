import { Request, Response } from 'express';
import LoginService from '../services/LoginService';

class LoginController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const { type, message } = await LoginService.login(email, password);
    if (type) {
      return res.status(type).json({ message });
    }
    return res.status(200).json({ token: message });
  }

  static async returnRole(req: Request, res: Response) {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'blank token' });
    }

    const returnRole = await LoginService.returnRole(token);
    return res.status(200).json({ role: returnRole });
  }
}

export default LoginController;
