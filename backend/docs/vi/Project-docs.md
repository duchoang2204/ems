# 📁 EMS Backend – Project Documentation

## ✅ Tổng quan cấu trúc
```
src/
├── app.ts                     ← Khởi tạo app express
├── server.ts                  ← Khởi động server
├── config/                    ← Cấu hình hệ thống & hằng số
│   ├── app.ts
│   ├── database/
│   └── constants/
├── core/                      ← Thành phần nền tảng (middleware, utils, db)
│   ├── middleware/
│   ├── utils/
│   └── database/
├── modules/                   ← Mỗi module là 1 nghiệp vụ
│   └── auth/
│       ├── domain/           ← Business rules & entities
│       ├── data-access/      ← Database interactions
│       ├── services/         ← Business logic
│       ├── usecases/        ← Application use cases
│       ├── controllers/     ← Request handling
│       ├── dto/            ← Data transfer objects
│       ├── schemas/        ← Validation schemas
│       ├── routes/         ← Route definitions
│       ├── di/            ← Dependency injection
│       └── types.ts       ← Type definitions
├── health/
├── migrations/
├── tests/
└── tsyringe.container.ts      ← Đăng ký DI
```

## 🎯 Coding Standards

### 1. Naming Conventions
- Files: lowercase với dấu gạch ngang (kebab-case)
  ```
  user-profile.service.ts
  create-user.usecase.ts
  ```
- Classes: PascalCase
  ```typescript
  export class UserProfileService {}
  export class CreateUserUseCase {}
  ```
- Interfaces: PascalCase với prefix I
  ```typescript
  export interface IUserRepository {}
  export interface IAuthService {}
  ```
- Variables & Methods: camelCase
  ```typescript
  const userProfile = await getUserById(userId);
  ```

### 2. File Organization
- Mỗi file chỉ export một class/interface chính
- Đặt related files trong cùng thư mục
- Sử dụng barrel exports (index.ts) cho các module lớn

### 3. Error Handling
- Sử dụng custom error classes
- Log errors với đầy đủ context
- Xử lý errors ở tầng phù hợp nhất
- Trả về error responses chuẩn cho client

### 4. Async/Await
- Luôn sử dụng async/await thay vì Promises
- Bọc async code trong try/catch
- Xử lý cleanup trong finally block

## ✅ Auth Module đã hoàn thành:
- [x] `auth.routes.ts`: POST `/auth/login`
- [x] `auth.controller.ts`: nhận & validate request → gọi usecase
- [x] `auth.schema.ts`: schema Zod cho login
- [x] `login.dto.ts`: DTO truyền dữ liệu login
- [x] `auth.repository.ts` (Oracle): gọi SP `W_SP_AUTH_LOGIN`, xử lý outBinds
- [x] `auth.service.ts`: xử lý logic & sinh JWT
- [x] `login.usecase.ts`: combine service + trả response cho FE
- [x] `auth.middleware.ts`: kiểm tra JWT
- [x] `validation.middleware.ts`: validate Zod schema
- [x] `di/tokens.ts`, `tsyringe.container.ts`: khai báo & inject DI

## 🔄 Development Workflow

### 1. Tạo Module Mới
1. Tham khảo `DDD-Module-Template.md`
2. Follow checklist trong `Module-Checklist.md`
3. Review code với team lead

### 2. Làm việc với Oracle
1. Đọc kỹ `Oracle-Common-Errors.md`
2. Test SP trên database test trước
3. Implement với đầy đủ error handling
4. Review performance của queries

### 3. Testing
1. Unit tests cho business logic
2. Integration tests cho repositories
3. E2E tests cho API endpoints
4. Test error cases và edge cases

## ⚠️ 14 lỗi thường gặp khi dùng Oracle + SP
| # | Vấn đề | Hướng xử lý |
|---|--------|-------------|
| 1 | Không ép kiểu `outBinds` | `as { outBinds: { p_user, p_error } }` |
| 2 | Không kiểm tra `cursor === null` | `if (!cursor) throw new Error()` |
| 3 | Không `getRows()` → SP return cursor nhưng không đọc |
| 4 | Không `await cursor.close()` sau khi `getRows()` |
| 5 | Không kiểm tra `rows.length === 0` |
| 6 | Không bắt `try/catch` quanh `execute()` |
| 7 | Không log `params`, `outBinds`, `metaData` khi debug |
| 8 | Không xử lý rõ lỗi `ORA-...` (ví dụ `ORA-06550`) |
| 9 | Dùng `conn` sau khi `finally conn.close()` |
| 10 | Không check `g_mabc` trước khi gọi SP |
| 11 | Dùng sai `type` trong `BIND_OUT` (`STRING` vs `CURSOR`) |
| 12 | Trả `undefined` ra FE nếu rows rỗng → FE crash |
| 13 | Không kiểm tra `error !== null` trong `outBinds.p_error` |
| 14 | Gọi sai SP hoặc truyền thiếu biến (Oracle silent error)|

## 🧠 Best Practices & Guidelines

### 1. Domain-Driven Design
- Tách biệt domain logic khỏi infrastructure
- Sử dụng entities cho business rules
- Implement repositories cho data access
- Định nghĩa rõ domain boundaries

### 2. Dependency Injection
- Sử dụng tsyringe cho DI
- Register dependencies trong container
- Inject dependencies qua constructor
- Sử dụng interfaces thay vì concrete classes

### 3. Error Handling
- Custom error classes cho domain errors
- Consistent error responses
- Proper error logging
- Graceful error recovery

### 4. Performance
- Connection pooling cho Oracle
- Caching khi cần thiết
- Optimize database queries
- Monitor performance metrics

### 5. Security
- Input validation
- JWT authentication
- Role-based authorization
- SQL injection prevention

## 📝 Ghi chú
- Tất cả nghiệp vụ sẽ ưu tiên gọi SP trước.
- Trường hợp **rất đơn giản** hoặc **cần custom logic**, sẽ xử lý SQL thuần tại `repository`.
- Cấu trúc theo DDD + DI chuẩn để đảm bảo mở rộng lâu dài.
- Tham khảo các template và checklist trong `/docs/vi/` khi phát triển.

Luồng mới sẽ hoạt động như sau:
Server khởi động → import reflect-metadata
App.ts import DI container → khởi tạo tất cả dependencies
Mount routes theo module: /api/auth/*, /api/shift/*
Các request sẽ đi qua controller → usecase → service → repository
Để test:
Chạy npm start hoặc npm run dev
Test API: POST /api/auth/login, POST /api/shift/check-current