import { ValueObject } from "../../value-objects/user/Password";
import { UserRole } from "../../value-objects/user/UserRole";

export class User {
  constructor(
    public manv: number,
    public tennv: string,
    public mkhau: string,
    public mucdo: number,
    public ketoan: number,
    public g_mabc: string
  ) {}

  // Có thể bổ sung các method nghiệp vụ nếu cần
  verifyPassword(password: string): boolean {
    return password === this.mkhau;
  }

  static create(
    manv: number, 
    tennv: string, 
    mkhau: string, 
    mucdo: number, 
    ketoan: number,
    g_mabc: string
  ): User {
    return new User(manv, tennv, mkhau, mucdo, ketoan, g_mabc);
  }
} 