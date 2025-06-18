# Hướng Dẫn Xác Thực (Authentication)

## Tổng Quan
Hệ thống sử dụng kiến trúc DDD, xác thực qua API `/api/auth/login`.
- Backend trả về: `{ ok, token, user }`
- Frontend nhận token, user và lưu vào session/localStorage.

## API Đăng Nhập
- **Endpoint:** `POST /api/auth/login`
- **Request body:**
```json
{
  "g_mabc": "string",  // Mã đơn vị
  "manv": number,       // Mã nhân viên
  "mkhau": "string"    // Mật khẩu
}
```
- **Response:**
```json
{
  "ok": true,
  "token": "string",   // JWT token
  "user": {
    "manv": number,
    "tennv": "string",
    "mucdo": number,
    "ketoan": number
  }
}
```

## Xử Lý Ở Frontend
- Gọi API qua hàm `login` trong `authApi.ts`:
```ts
const res = await login(g_mabc, manv, mkhau);
const { token, user } = res.data;
```
- Lưu token, user vào session/localStorage.
- Sau khi login thành công, chuyển hướng sang dashboard.

## Kiểm Tra Ca Làm Việc
- Sau khi login, frontend gọi API kiểm tra ca (`checkShift`).
- Nếu hợp lệ mới cho vào hệ thống.

## Lưu Ý
- Token JWT có hạn 12h, chứa thông tin user.
- Luôn kiểm tra token và ca làm việc trước khi thao tác.

## Tham khảo thêm
- Xem file `DEVELOPMENT_GUIDELINES.md` để biết flow chuẩn và cấu trúc code.

## Các Mức Độ Quyền
| Mức độ | Tên | Mô tả |
|--------|-----|--------|
| 1 | Nhân viên khai thác | Quyền cơ bản, thực hiện các thao tác khai thác |
| 2 | Kiểm soát viên | Quyền kiểm soát, giám sát hoạt động |
| 7 | Kế toán | Quyền kế toán, xử lý các nghiệp vụ tài chính |
| 9 | Admin | Quyền quản trị hệ thống |

## Bảo Mật
1. **Mật khẩu**:
   - Độ dài tối thiểu: 6 ký tự
   - Không được để trống
   - Nên sử dụng kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt

2. **Token**:
   - Thời hạn: 12 giờ
   - Chứa thông tin: manv, mucdo, ketoan, g_mabc
   - Được mã hóa bằng JWT_SECRET

## Xử Lý Lỗi
| Mã lỗi | Mô tả |
|--------|--------|
| USER_NOT_FOUND | Mã nhân viên không tồn tại |
| WRONG_PASSWORD | Mật khẩu không chính xác |
| TOKEN_EXPIRED | Token đã hết hạn |
| INVALID_TOKEN | Token không hợp lệ |

## Middleware
1. **requireRole**:
   - Kiểm tra quyền truy cập
   - Sử dụng: `requireRole(mucdo)`

2. **requireActiveShift**:
   - Kiểm tra ca làm việc
   - Sử dụng: `requireActiveShift()`

## Kiểm Tra Ca Làm Việc

### 1. Cấu Trúc Dữ Liệu
```typescript
interface Shift {
  id: number;
  name: string;
  startTime: string;  // Format: "HH:mm"
  endTime: string;    // Format: "HH:mm"
  isActive: boolean;
}

interface UserShift {
  userId: number;
  shiftId: number;
  date: string;      // Format: "YYYY-MM-DD"
  status: 'active' | 'inactive';
}
```

### 2. Kiểm Tra Ca Hiện Tại
```typescript
// Kiểm tra xem người dùng có đang trong ca làm việc không
const isInActiveShift = await shiftService.checkUserActiveShift(userId);

// Kiểm tra xem ca làm việc có đang hoạt động không
const isShiftActive = await shiftService.isShiftActive(shiftId);

// Lấy thông tin ca làm việc hiện tại
const currentShift = await shiftService.getCurrentShift();
```

### 3. Middleware Kiểm Tra Ca
```typescript
// Middleware kiểm tra ca làm việc
const requireActiveShift = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.manv;
  
  try {
    const isInShift = await shiftService.checkUserActiveShift(userId);
    
    if (!isInShift) {
      return res.status(403).json({
        ok: false,
        error: 'NOT_IN_ACTIVE_SHIFT',
        message: 'Người dùng không trong ca làm việc hiện tại'
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};
```

### 4. Sử Dụng Middleware
```typescript
// Áp dụng middleware cho route
router.post('/some-action', 
  requireAuth,           // Kiểm tra xác thực
  requireActiveShift,    // Kiểm tra ca làm việc
  async (req, res) => {
    // Xử lý logic
  }
);
```

### 5. Xử Lý Lỗi Ca Làm Việc
| Mã lỗi | Mô tả |
|--------|--------|
| NOT_IN_ACTIVE_SHIFT | Người dùng không trong ca làm việc |
| SHIFT_NOT_FOUND | Không tìm thấy thông tin ca |
| SHIFT_INACTIVE | Ca làm việc không hoạt động |

### 6. Ví Dụ Sử Dụng
```typescript
// Kiểm tra và xử lý ca làm việc
async function handleShiftOperation(userId: number) {
  // Kiểm tra ca làm việc
  const shiftStatus = await shiftService.getUserShiftStatus(userId);
  
  if (!shiftStatus.isActive) {
    throw new Error('NOT_IN_ACTIVE_SHIFT');
  }
  
  // Thực hiện các thao tác khi trong ca
  await performOperation();
}
```

### 7. Lưu Ý Quan Trọng
1. Luôn kiểm tra ca làm việc trước khi thực hiện các thao tác quan trọng
2. Cập nhật trạng thái ca làm việc khi người dùng đăng nhập/đăng xuất
3. Xử lý các trường hợp chuyển ca (ca sáng -> ca chiều)
4. Lưu log các thay đổi trạng thái ca làm việc
5. Có cơ chế xử lý khi ca làm việc bị gián đoạn

## Ví Dụ Sử Dụng
```typescript
// Kiểm tra quyền admin
if (user.role.isAdmin()) {
  // Xử lý logic cho admin
}

// Kiểm tra quyền kế toán
if (user.role.isKeToan()) {
  // Xử lý logic cho kế toán
}

// Kiểm tra quyền truy cập
if (user.role.hasPermission(requiredLevel)) {
  // Cho phép truy cập
}
```

## Lưu Ý Quan Trọng
1. Luôn kiểm tra token trước khi thực hiện các thao tác
2. Không lưu trữ mật khẩu dưới dạng plain text
3. Luôn sử dụng HTTPS cho các request
4. Thường xuyên thay đổi mật khẩu
5. Không chia sẻ token với người khác 