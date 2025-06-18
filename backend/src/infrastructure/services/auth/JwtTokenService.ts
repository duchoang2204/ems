import { injectable } from 'tsyringe';
import { User } from '../../../domain/entities/user/User';
import jwt, { SignOptions } from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../../config/jwt';

@injectable()
export class JwtTokenService {
  generateToken(user: User): string {
    const payload = {
      manv: user.manv,
      tennv: user.tennv,
      mucdo: user.mucdo,
      ketoan: user.ketoan,
      g_mabc: user.g_mabc
    };

    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
    };

    return jwt.sign(payload, JWT_SECRET, options);
  }
} 