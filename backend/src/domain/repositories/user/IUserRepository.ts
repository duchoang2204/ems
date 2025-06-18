import { User } from "../../entities/user/User";

export interface IUserRepository {
  findByManv(g_mabc: string, manv: number, mkhau: string): Promise<User | null>;
  findByUsername(g_mabc: string, username: string): Promise<User | null>;
} 