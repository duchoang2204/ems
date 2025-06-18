# Hướng Dẫn Cài Đặt và Cấu Hình

## Yêu Cầu Hệ Thống
- Node.js >= 14
- Oracle Database
- npm hoặc yarn

## Cài Đặt

### 1. Clone Repository
```bash
git clone [repository-url]
cd ems/backend
```

### 2. Cài Đặt Dependencies
```bash
npm install
```

### 3. Cấu Hình Môi Trường
Tạo file `.env` trong thư mục `backend`:
```env
# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=12h

# Database Configuration
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_SERVICE=your_db_service
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Cấu Hình TypeScript
File `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Chạy Ứng Dụng

### 1. Development Mode
```bash
npm run dev
```

### 2. Production Mode
```bash
npm run build
npm start
```

### 3. Testing
```bash
npm test
```

## Cấu Trúc Database

### 1. Bảng NVIEN
```sql
CREATE TABLE NVIEN (
  MANV NUMBER PRIMARY KEY,
  TENNV VARCHAR2(100),
  MKHAU VARCHAR2(100),
  MUCDO NUMBER,
  KETOAN NUMBER,
  G_MABC VARCHAR2(10)
);
```

### 2. Các Bảng Khác
[Thêm mô tả các bảng khác nếu có]

## Các Lệnh NPM

| Lệnh | Mô tả |
|------|--------|
| `npm run dev` | Chạy ở chế độ development |
| `npm run build` | Build project |
| `npm start` | Chạy ở chế độ production |
| `npm test` | Chạy tests |
| `npm run lint` | Kiểm tra code style |
| `npm run format` | Format code |

## Xử Lý Lỗi Thường Gặp

### 1. Lỗi Kết Nối Database
- Kiểm tra thông tin kết nối trong `.env`
- Đảm bảo Oracle Database đang chạy
- Kiểm tra quyền truy cập

### 2. Lỗi TypeScript
- Chạy `npm run build` để xem lỗi chi tiết
- Kiểm tra `tsconfig.json`
- Cập nhật các type definitions

### 3. Lỗi JWT
- Kiểm tra `JWT_SECRET` trong `.env`
- Đảm bảo token được gửi đúng format
- Kiểm tra thời hạn token

## Bảo Mật

### 1. Environment Variables
- Không commit file `.env`
- Sử dụng `.env.example` làm template
- Bảo vệ các thông tin nhạy cảm

### 2. Database
- Sử dụng connection pooling
- Mã hóa mật khẩu
- Giới hạn quyền truy cập

### 3. API
- Sử dụng HTTPS
- Validate input
- Rate limiting
- CORS configuration

## Monitoring và Logging

### 1. Logging
```typescript
// Sử dụng winston cho logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 2. Monitoring
- Sử dụng PM2 cho process management
- Cấu hình health check endpoints
- Monitor database connections

## Deployment

### 1. Production
- Build project: `npm run build`
- Start server: `npm start`
- Sử dụng PM2: `pm2 start dist/app.js`

### 2. Docker
```dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Liên Hệ
- Email: [your-email]
- Team: [team-info]
- Documentation: [docs-url] 