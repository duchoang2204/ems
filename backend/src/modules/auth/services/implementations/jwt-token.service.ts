import { injectable } from 'tsyringe';
import { User } from '../../domain/entities/user.entity';
import jwt, { SignOptions } from 'jsonwebtoken';

@injectable()
export class JwtTokenService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

  generateToken(user: User): string {
    const payload = {
      manv: user.manv,
      tennv: user.tennv,
      mucdo: user.mucdo,
      ketoan: user.ketoan,
      g_mabc: user.g_mabc
    };

    const options: SignOptions = {
      expiresIn: this.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
    };

    return jwt.sign(payload, this.JWT_SECRET, options);
  }
} 