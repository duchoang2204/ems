# Authentication API

## Login

Đăng nhập vào hệ thống.

### Endpoint

```
POST /api/auth/login
```

### Request Body

```json
{
  "g_mabc": "string",  // Mã đơn vị
  "manv": number,      // Mã nhân viên
  "mkhau": "string"    // Mật khẩu
}
```

### Response

#### Success (200 OK)

```json
{
  "ok": true,
  "token": "string",   // JWT token
  "user": {
    "manv": number,    // Mã nhân viên
    "tennv": "string", // Tên nhân viên
    "mucdo": number,   // Mức độ quyền
    "ketoan": number   // Quyền kế toán
  }
}
```

#### Error (401 Unauthorized)

```json
{
  "ok": false,
  "code": "USER_NOT_FOUND" | "WRONG_PASSWORD",
  "msg": "Mã nhân viên không tồn tại!" | "Mật khẩu không chính xác!"
}
```

### Role Levels

| Mức độ | Tên | Mô tả |
|--------|-----|--------|
| 1 | Nhân viên khai thác | Quyền cơ bản |
| 2 | Kiểm soát viên | Quyền kiểm soát |
| 7 | Kế toán | Quyền kế toán |
| 9 | Admin | Quyền quản trị |

### Token

- Token được tạo bằng JWT
- Thời hạn: 12 giờ
- Payload chứa: manv, mucdo, ketoan, g_mabc 