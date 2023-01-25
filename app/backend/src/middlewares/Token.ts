import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../database/models/User';

class Token {
  static async verify(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'No Token Reported' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
      const userRole = await User.findByPk(decoded.data.id);
      if (userRole?.role !== 'admin') {
        return res.status(403).json({ message: 'User is not admin' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }
  }
}

export default Token;
