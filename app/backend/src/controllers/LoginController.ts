import { Request, Response } from 'express';
import LoginService from '../services/LoginService';

class LoginController {
  static async login(req: Request, res: Response) {
    const { username, password } = req.body;

    const { type, message } = await LoginService.login(username, password);
    if (type) {
      return res.status(type).json({ message });
    }
    return res.status(200).json({ token: message });
  }
}

export default LoginController;
