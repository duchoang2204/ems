export enum RoleLevel {
  KHAI_THAC = 1,    // Nhân viên khai thác
  KIEM_SOAT = 2,    // Kiểm soát viên
  KE_TOAN = 7,      // Kế toán
  ADMIN = 9         // Admin
}

export class UserRole {
  private constructor(private readonly level: number) {}

  public static create(level: number): UserRole {
    if (!Object.values(RoleLevel).includes(level)) {
      throw new Error(`Invalid role level. Allowed values: ${Object.values(RoleLevel).join(', ')}`);
    }
    return new UserRole(level);
  }

  public hasPermission(requiredLevel: number): boolean {
    return this.level >= requiredLevel;
  }

  public getLevel(): number {
    return this.level;
  }

  public isKhaiThac(): boolean {
    return this.level === RoleLevel.KHAI_THAC;
  }

  public isKiemSoat(): boolean {
    return this.level === RoleLevel.KIEM_SOAT;
  }

  public isKeToan(): boolean {
    return this.level === RoleLevel.KE_TOAN;
  }

  public isAdmin(): boolean {
    return this.level === RoleLevel.ADMIN;
  }

  public getRoleName(): string {
    switch (this.level) {
      case RoleLevel.KHAI_THAC:
        return 'Nhân viên khai thác';
      case RoleLevel.KIEM_SOAT:
        return 'Kiểm soát viên';
      case RoleLevel.KE_TOAN:
        return 'Kế toán';
      case RoleLevel.ADMIN:
        return 'Admin';
      default:
        return 'Unknown';
    }
  }
} 