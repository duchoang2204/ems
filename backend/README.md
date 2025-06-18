# EMS Backend

Backend cho hệ thống EMS (Enterprise Management System) được xây dựng theo Domain-Driven Design (DDD).

## Cấu trúc Project

```
src/
├── domain/           # Domain Layer
│   ├── entities/     # Domain Entities
│   ├── value-objects/# Value Objects
│   ├── services/     # Domain Services
│   └── repositories/ # Repository Interfaces
├── infrastructure/   # Infrastructure Layer
│   ├── repositories/ # Repository Implementations
│   └── services/     # External Services
└── interfaces/       # Interface Layer
    └── controllers/  # Controllers
```

## Authentication

Hệ thống sử dụng JWT (JSON Web Token) cho authentication.

### Role Levels

| Mức độ | Tên | Mô tả |
|--------|-----|--------|
| 1 | Nhân viên khai thác | Quyền cơ bản |
| 2 | Kiểm soát viên | Quyền kiểm soát |
| 7 | Kế toán | Quyền kế toán |
| 9 | Admin | Quyền quản trị |

## Development

### Prerequisites

- Node.js >= 14
- Oracle Database

### Installation

```bash
npm install
```

### Configuration

Tạo file `.env` với các biến môi trường cần thiết:

```env
JWT_SECRET=your_jwt_secret
```

### Running

```bash
npm run dev
```

## Testing

```bash
npm test
```

## Documentation

Chi tiết API và domain documentation có thể tìm thấy trong thư mục `docs/`. 