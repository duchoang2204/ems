# Authentication Domain

## Entities

### User

Entity đại diện cho người dùng trong hệ thống.

```typescript
class User {
  private constructor(
    private readonly _manv: number,      // Mã nhân viên
    private readonly _tennv: string,     // Tên nhân viên
    private readonly _password: ValueObject, // Mật khẩu
    private readonly _role: UserRole,    // Vai trò
    private readonly _ketoan: number,    // Quyền kế toán
    private readonly _g_mabc: string     // Mã đơn vị
  )
}
```

## Value Objects

### UserRole

Quản lý và validate vai trò người dùng.

```typescript
enum RoleLevel {
  KHAI_THAC = 1,    // Nhân viên khai thác
  KIEM_SOAT = 2,    // Kiểm soát viên
  KE_TOAN = 7,      // Kế toán
  ADMIN = 9         // Admin
}
```

### Password

Quản lý và validate mật khẩu.

```typescript
class ValueObject {
  private constructor(private readonly value: string)
}
```

## Domain Services

### AuthService

Xử lý logic xác thực người dùng.

```typescript
class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  )
}
```

## Business Rules

1. **Password Rules**:
   - Độ dài tối thiểu: 6 ký tự
   - Không được để trống

2. **Role Rules**:
   - Chỉ cho phép các mức độ: 1, 2, 7, 9
   - Mỗi mức độ có quyền hạn riêng

3. **Authentication Rules**:
   - Token hết hạn sau 12 giờ
   - Mỗi token chứa thông tin: manv, mucdo, ketoan, g_mabc

## Dependencies

- IUserRepository: Interface cho việc truy xuất dữ liệu user
- ITokenService: Interface cho việc tạo và verify token 