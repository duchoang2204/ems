# Hướng Dẫn Cấu Trúc DDD

## Tổng Quan
DDD (Domain-Driven Design) là phương pháp thiết kế phần mềm tập trung vào domain (lĩnh vực) của ứng dụng. Cấu trúc DDD giúp code dễ bảo trì, mở rộng và test.

## Cấu Trúc Thư Mục
```
src/
├── domain/           # Tầng Domain
│   ├── entities/     # Các Entity
│   ├── value-objects/# Các Value Object
│   ├── services/     # Domain Services
│   └── repositories/ # Repository Interfaces
├── infrastructure/   # Tầng Infrastructure
│   ├── repositories/ # Repository Implementations
│   └── services/     # External Services
└── interfaces/       # Tầng Interface
    └── controllers/  # Controllers
```

## Giải Thích Các Tầng

### 1. Domain Layer (Tầng Domain)
- **Entities**: Đại diện cho các đối tượng chính trong hệ thống
  ```typescript
  class User {
    private constructor(
      private readonly _manv: number,
      private readonly _tennv: string,
      // ...
    )
  }
  ```

- **Value Objects**: Đối tượng không thay đổi, xác định bởi thuộc tính
  ```typescript
  class UserRole {
    private constructor(private readonly level: number)
  }
  ```

- **Domain Services**: Xử lý logic nghiệp vụ phức tạp
  ```typescript
  class AuthService {
    constructor(
      private readonly userRepository: IUserRepository,
      private readonly tokenService: ITokenService
    )
  }
  ```

### 2. Infrastructure Layer (Tầng Cơ Sở)
- **Repositories**: Triển khai các interface từ domain
  ```typescript
  class OracleUserRepository implements IUserRepository {
    async findByManv(g_mabc: string, manv: number): Promise<User | null>
  }
  ```

- **External Services**: Kết nối với các dịch vụ bên ngoài
  ```typescript
  class JwtTokenService implements ITokenService {
    generateToken(payload: TokenPayload): string
  }
  ```

### 3. Interface Layer (Tầng Giao Diện)
- **Controllers**: Xử lý HTTP requests/responses
  ```typescript
  class AuthController {
    constructor(private authService: AuthService)
    async login(req: Request, res: Response)
  }
  ```

## Nguyên Tắc Quan Trọng

### 1. Dependency Injection
- Sử dụng DI Container để quản lý dependencies
- Giảm sự phụ thuộc giữa các module
- Dễ dàng test và thay đổi implementation

### 2. Clean Architecture
- Domain layer không phụ thuộc vào các layer khác
- Infrastructure layer phụ thuộc vào domain layer
- Interface layer phụ thuộc vào domain layer

### 3. SOLID Principles
- Single Responsibility: Mỗi class chỉ có một nhiệm vụ
- Open/Closed: Mở rộng, đóng sửa đổi
- Liskov Substitution: Thay thế được
- Interface Segregation: Tách interface
- Dependency Inversion: Đảo ngược phụ thuộc

## Ví Dụ Thực Tế

### 1. Tạo User
```typescript
// Domain Layer
const user = User.create(manv, tennv, password, mucdo, ketoan, g_mabc);

// Infrastructure Layer
await userRepository.save(user);

// Interface Layer
res.json({ ok: true, user });
```

### 2. Xác Thực
```typescript
// Domain Layer
const result = await authService.authenticate(g_mabc, manv, password);

// Interface Layer
res.json({ ok: true, ...result });
```

## Lưu Ý Khi Phát Triển
1. Luôn đặt business logic trong domain layer
2. Sử dụng interfaces để định nghĩa contracts
3. Tránh phụ thuộc trực tiếp giữa các layer
4. Sử dụng value objects cho các đối tượng không thay đổi
5. Tách biệt rõ ràng giữa domain logic và infrastructure 

## Quy tắc DDD + tsyringe (chuẩn hóa toàn bộ backend)
- Sử dụng tsyringe cho Dependency Injection:
  - @injectable() cho tất cả class cần inject
  - @inject('TênToken') cho constructor injection
  - Đăng ký repository implementation với tsyringe:
    ```ts
    import { container } from 'tsyringe';
    container.register<IUserRepository>('UserRepository', { useClass: UserRepository });
    ```
- Không dùng inversify, không dùng Symbol cho DI token.
- Không import chéo giữa các tầng (controller không import repository implementation).

## Luồng Xử Lý Module Van-Chuyen
1. Nhận request từ FE (ví dụ: /api/van-chuyen/search)
2. Controller nhận request, parse DTO, gọi usecase
3. UseCase xử lý logic, gọi repository
4. Repository truy vấn DB, trả về entity/DTO
5. UseCase trả kết quả cho controller
6. Controller trả response cho FE

- Không xử lý logic nghiệp vụ ở controller
- Repository chỉ truy vấn DB, không xử lý logic
- UseCase xử lý logic ứng dụng, không truy vấn DB trực tiếp 

## Định nghĩa nghiệp vụ & vai trò các bảng dữ liệu vận chuyển

### 1. Các cơ sở chính
- **HNLT (100916)**: Hà Nội Liên Tỉnh
- **HCMLT (700916)**: Hồ Chí Minh Liên Tỉnh
- **HNNT (101000)**: Hà Nội Nội Tỉnh

### 2. Quy trình nghiệp vụ tổng quan
- Người dùng tại 3 cơ sở trên thực hiện nhận túi đến, túi đi, chia chọn bưu phẩm theo hành trình đường thư.
- Dữ liệu nghiệp vụ được ghi và lấy từ các bảng:
  - **kpi_postbag_bccp** (Oracle): bảng tổng hợp túi, chuyến thư, đường thư, dùng cho nghiệp vụ chính.
  - **e1e2, e1e1, e1i2, e1i1, e1e2_hktv, e1e1_hktv, ...**: các bảng chi tiết/tổng quát mã E1, xác nhận đến/đi, dữ liệu quá giang.

### 3. Vai trò các bảng dữ liệu
- **e1e2**: Chi tiết mã E1 đến liên tỉnh (100916, 700916).
- **e2e2**: Tổng quát túi số đến liên tỉnh.
- **e1e2_ds**: Chi tiết mã E1 xác nhận đến liên tỉnh.
- **e2e2_ds**: Tổng quát xác nhận đến liên tỉnh.
- **e1i2**: Chi tiết mã E1 đi liên tỉnh (100916, 700916).
- **e2i2**: Tổng quát đi liên tỉnh.
- **e1e2_hktv**: Dữ liệu quá giang (túi nhận tại 100916, 700916 nhưng mabc không phải 100916, 700916).
- **e2e2_hktv**: Tổng quát quá giang liên tỉnh.

- **e1e1**: Chi tiết mã E1 đến nội tỉnh (101000).
- **e2e1**: Tổng quát túi số đến nội tỉnh.
- **e1e1_ds**: Chi tiết mã E1 xác nhận đến nội tỉnh.
- **e2e1_ds**: Tổng quát xác nhận đến nội tỉnh.
- **e1i1**: Chi tiết mã E1 đi nội tỉnh (101000).
- **e2i1**: Tổng quát đi nội tỉnh.
- **e1e1_hktv**: Dữ liệu quá giang nội tỉnh (túi nhận tại 101000 nhưng mabc không phải 101000).
- **e2e1_hktv**: Tổng quát quá giang nội tỉnh.

- **kpi_postbag_bccp**: Bảng tổng hợp túi, chuyến thư, đường thư, dùng khi các bảng chi tiết không có dữ liệu.

### 4. Định nghĩa các khái niệm
- **Liên tỉnh**: Dữ liệu/túi đi/đến giữa các tỉnh, dùng cho HNLT (100916), HCMLT (700916).
- **Nội tỉnh**: Dữ liệu/túi đi/đến trong cùng tỉnh, dùng cho HNNT (101000).
- **Quá giang**: Túi nhận tại một cơ sở lớn (100916, 700916, 101000) nhưng mã bưu cục không thuộc các mã này.
- **Xác nhận đến/đi**: Dữ liệu xác nhận mã E1 đã đến/đi tại từng cơ sở, từng túi, từng chuyến thư.

### 5. Lưu ý phát triển
- Không tự ý thay đổi logic nghiệp vụ/truy vấn gốc.
- Không thêm trường vào DTO/entity nếu DB không có.
- Luôn kiểm tra types/schema trước khi sửa đổi.
- Mọi thay đổi phải xác thực với nghiệp vụ và được review. 