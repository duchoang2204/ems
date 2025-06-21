import { injectable, inject } from 'tsyringe';
import { LoginRequestDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { AuthService } from '../services/implementations/auth.service';
import { IUserRepository } from '../domain/repositories/auth.repository.interface';
import { JwtTokenService } from '../services/implementations/jwt-token.service';
import { User } from '../domain/entities/user.entity';


@injectable()
export class LoginUseCase {
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject(JwtTokenService) private jwtTokenService: JwtTokenService
  ) {}
  
  async execute(request: LoginRequestDto): Promise<LoginResponseDto> {
    const tStart = Date.now();
    try {
      // Validate input
      if (!request.g_mabc || !request.manv || !request.mkhau) {
        throw new Error('INVALID_INPUT');
      }
      console.log('[LOGIN][UseCase] Bắt đầu xử lý login');
      // 1. Lấy user từ repo (truyền g_mabc, manv, mkhau)
      const tFindUserStart = Date.now();
      let user: User | null = null;
      try {
        user = await this.userRepository.findByManv(request.g_mabc, request.manv, request.mkhau);
      } catch (err: any) {
        // Mapping lỗi từ repository
        if (err.message === 'INVALID_G_MABC') {
          throw new Error('INVALID_G_MABC');
        }
        if (err.message === 'INVALID_CREDENTIALS') {
          throw new Error('INVALID_CREDENTIALS');
        }
        throw new Error('SYSTEM_ERROR');
      }
      const tFindUserEnd = Date.now();
      console.log(`[LOGIN][UseCase] Thời gian truy vấn userRepository.findByManv: ${tFindUserEnd - tFindUserStart} ms`);
      if (!user) {
        throw new Error('INVALID_CREDENTIALS');
      }

      // 2. Tạo token
      const tTokenStart = Date.now();
      const token = this.jwtTokenService.generateToken(user);
      const tTokenEnd = Date.now();
      console.log(`[LOGIN][UseCase] Thời gian tạo JWT token: ${tTokenEnd - tTokenStart} ms`);

      // 3. Trả về response
      const tEnd = Date.now();
      console.log(`[LOGIN][UseCase] Tổng thời gian thực thi usecase: ${tEnd - tStart} ms`);
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