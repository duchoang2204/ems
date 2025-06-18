import { User } from '../../../domain/entities/user/User';
export interface LoginResponseDto {
  user: User;
  token: string;
} 