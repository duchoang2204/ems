import { container } from 'tsyringe';
import { AUTH_TOKENS } from './tokens';
import { LoginUseCase } from '../usecases/login.usecase';
import { AuthService } from '../services/implementations/auth.service';
import { OracleUserRepository } from '../data-access/oracle/auth.repository';
import { JwtTokenService } from '../services/implementations/jwt-token.service';

// Register auth module dependencies
container.registerSingleton(AUTH_TOKENS.LoginUseCase, LoginUseCase);
container.registerSingleton(AUTH_TOKENS.AuthService, AuthService);
container.registerSingleton(AUTH_TOKENS.AuthRepository, OracleUserRepository);
container.registerSingleton(AUTH_TOKENS.JwtTokenService, JwtTokenService); 