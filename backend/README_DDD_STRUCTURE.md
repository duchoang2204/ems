# EMS Backend - DDD Structure Guide

## 1. Tổng Quan Kiến Trúc DDD
- Dự án backend sử dụng Domain-Driven Design (DDD) để tách biệt rõ ràng các tầng: domain, infrastructure, interfaces, routes.
- Mỗi module nghiệp vụ lớn (ví dụ: login, shift, van-chuyen) đều có cấu trúc riêng, dễ mở rộng và bảo trì.

## 2. Cấu Trúc Thư Mục Chuẩn
```
src/
├── domain/
│   ├── entities/           # Định nghĩa Entity cho từng module
│   ├── repositories/       # Interface repository cho từng module
│   └── services/           # Domain service cho từng module
├── infrastructure/
│   ├── repositories/       # Triển khai repository kết nối DB
│   └── services/           # Service external (JWT, email, ...)
├── interfaces/
│   └── controllers/        # Controller cho từng module
├── routes/                 # Định nghĩa route cho từng module
├── config/                 # Cấu hình DI container, DB, ...
├── middleware/             # Middleware chung
```

## 3. Ví Dụ Module Login (Authentication)
```
src/
├── domain/services/auth/AuthService.ts
├── infrastructure/services/auth/JwtTokenService.ts
├── infrastructure/services/auth/ITokenService.ts
├── interfaces/controllers/auth/AuthController.ts
├── routes/auth/auth.route.ts
```
- **AuthService**: Xử lý logic xác thực, gọi repository và token service.
- **JwtTokenService**: Sinh và xác thực JWT.
- **AuthController**: Nhận request, trả response.
- **auth.route.ts**: Định nghĩa endpoint `/login`.

## 4. Ví Dụ Module Shift (Ca làm việc)
```
src/
├── domain/entities/shift/Shift.ts
├── domain/repositories/IShiftRepository.ts
├── domain/services/shift/ShiftService.ts
├── infrastructure/repositories/OracleShiftRepository.ts
├── interfaces/controllers/shift/ShiftController.ts
├── routes/shift/shift.route.ts
```
- **Shift**: Entity đại diện cho ca làm việc.
- **IShiftRepository**: Interface truy vấn ca làm việc.
- **OracleShiftRepository**: Triển khai truy vấn DB Oracle.
- **ShiftService**: Xử lý logic kiểm tra ca.
- **ShiftController**: Nhận request, trả response.
- **shift.route.ts**: Định nghĩa endpoint `/shift/check`.

## 5. Quy Ước & Lưu Ý
- Mỗi module nên có thư mục riêng nếu nghiệp vụ lớn.
- Tất cả truy vấn DB phải qua repository.
- Logic nghiệp vụ đặt ở domain service.
- Controller chỉ nhận request, trả response, không chứa logic nghiệp vụ.
- Sử dụng DI container để inject dependencies.

## 6. Tham Khảo
- Xem thêm các file hướng dẫn trong `docs/vi/` để hiểu rõ flow và quy tắc phát triển.

## 7. Quy tắc DDD + tsyringe (chuẩn hóa toàn bộ backend)
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

## 8. Luồng Xử Lý Module Van-Chuyen
1. Nhận request từ FE (ví dụ: /api/van-chuyen/search)
2. Controller nhận request, parse DTO, gọi usecase
3. UseCase xử lý logic, gọi repository
4. Repository truy vấn DB, trả về entity/DTO
5. UseCase trả kết quả cho controller
6. Controller trả response cho FE

- Không xử lý logic nghiệp vụ ở controller
- Repository chỉ truy vấn DB, không xử lý logic
- UseCase xử lý logic ứng dụng, không truy vấn DB trực tiếp 