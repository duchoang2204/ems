import { User } from '../domain/entities/user.entity';
export interface LoginResponseDto {
  user: User;
  token: string;
} 