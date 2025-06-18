import 'reflect-metadata';
import { container } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/user/IUserRepository';
import { OracleUserRepository } from '../infrastructure/repositories/user/OracleUserRepository';
import { AuthService } from '../domain/services/auth/AuthService';
import { JwtTokenService } from '../infrastructure/services/auth/JwtTokenService';
import { LoginUseCase } from '../application/use-cases/auth/LoginUseCase';
import { AuthController } from '../interfaces/controllers/auth/AuthController';
import { IShiftRepository } from '../domain/repositories/shift/IShiftRepository';
import { OracleShiftRepository } from '../infrastructure/repositories/shift/OracleShiftRepository';
import { CheckCurrentShiftUseCase } from '../application/use-cases/shift/CheckCurrentShiftUseCase';
import { ShiftController } from '../interfaces/controllers/shift/ShiftController';
// Đăng ký các repository, service, use-case cho user và shift ở đây

container.register<IUserRepository>('UserRepository', { useClass: OracleUserRepository });
container.registerSingleton(AuthService);
container.registerSingleton(JwtTokenService);
container.registerSingleton(LoginUseCase);
container.registerSingleton(AuthController);

container.register<IShiftRepository>('ShiftRepository', { useClass: OracleShiftRepository });
container.registerSingleton(CheckCurrentShiftUseCase);
container.registerSingleton(ShiftController); 