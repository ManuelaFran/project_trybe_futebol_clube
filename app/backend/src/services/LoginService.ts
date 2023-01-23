import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import User from '../database/models/User';
import ErrorMap from '../utils/errorMap';

interface IResponse {
  type: ErrorMap | null,
  message: string
}

class LoginService {
  private static createToken(userId: number): string {
    const token = jwt.sign({ data: { id: userId } }, process.env.JWT_SECRET as string);
    return token;
  }

  private static decodeToken(token: string) {
    const decoded = jwt.decode(token);
    return decoded as jwt.JwtPayload;
  }

  static async login(email: string, password: string): Promise<IResponse> {
    if (!email || !password) {
      return { type: ErrorMap.BAD_REQUEST, message: 'All fields must be filled' };
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { type: ErrorMap.UNAUTHORIZED, message: 'Incorrect email or password' };
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return { type: ErrorMap.UNAUTHORIZED, message: 'Incorrect email or password' };
    }
    const token = LoginService.createToken(user.id);
    return { type: null, message: token };
  }

  static async returnRole(token: string): Promise<string | undefined> {
    const decoded = LoginService.decodeToken(token);
    const user = await User.findByPk(decoded.data.id, { attributes: ['role'] });
    return user?.role;
  }
}

export default LoginService;
