import { injectable } from 'tsyringe';
import { User } from '../../entities/user/User';

@injectable()
export class AuthService {
  verifyPassword(user: User, password: string): boolean {
    // TODO: So sánh password (giả lập)
    // Thực tế nên hash và so sánh hash
    return user.mkhau === password;
  }
} 