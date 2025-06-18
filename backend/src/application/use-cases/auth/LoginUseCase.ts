import { injectable, inject } from 'tsyringe';
import { LoginRequestDto } from '../../dto/auth/LoginRequestDto';
import { LoginResponseDto } from '../../dto/auth/LoginResponseDto';
import { AuthService } from '../../../domain/services/auth/AuthService';
import { IUserRepository } from '../../../domain/repositories/user/IUserRepository';
import { JwtTokenService } from '../../../infrastructure/services/auth/JwtTokenService';

@injectable()
export class LoginUseCase {
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject(JwtTokenService) private jwtTokenService: JwtTokenService
  ) {}
  
  async execute(request: LoginRequestDto): Promise<LoginResponseDto> {
    try {
      // 1. Lấy user từ repo (truyền g_mabc, manv, mkhau)
      console.log('LoginUseCase.execute nhận:', request);
      const user = await this.userRepository.findByManv(request.g_mabc, request.manv, request.mkhau);
      if (!user) {
        throw new Error('INVALID_CREDENTIALS');
      }

      // 2. Tạo token
      const token = this.jwtTokenService.generateToken(user);

      // 3. Trả về response
      return {
        user: user,
        token: token
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error; // Re-throw stored procedure errors
      }
      throw new Error('SYSTEM_ERROR');
    }
  }
} 