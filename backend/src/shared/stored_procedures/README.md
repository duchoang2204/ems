# Stored Procedures Documentation

Thư mục này dùng để quản lý toàn bộ Stored Procedure (SP) mà hệ thống backend sử dụng.

## Cách sử dụng
- **Khai báo tên SP**: Sử dụng file `sp-names.ts` để mapping tên các SP dùng trong code.
- **Script tạo SP**: Có thể lưu các file `.sql` (ví dụ: `auth.sql`, `shift.sql`, ...) để lưu script tạo hoặc cập nhật SP.
- **Tài liệu hóa**: Ghi chú input/output, nghiệp vụ, ví dụ sử dụng cho từng SP ngay tại đây hoặc trong từng file `.sql`.

## Ví dụ khai báo tên SP
```ts
export const SP_NAMES = {
  LOGIN: 'W_SP_AUTH_LOGIN',
  CHECK_CURRENT_SHIFT: 'W_SP_SHIFT_CHECK_CURRENT',
  // ...
};
```

## Ví dụ tài liệu hóa SP
### W_SP_AUTH_LOGIN
- **Input**:
  - `p_g_mabc` (number): Mã đơn vị
  - `p_manv` (number): Mã nhân viên
  - `p_mkhau` (number): Mật khẩu
- **Output**:
  - `p_user` (cursor): Thông tin user
  - `p_error` (string): Lỗi nếu có

### W_SP_SHIFT_CHECK_CURRENT
- **Input**:
  - `p_g_mabc` (number): Mã đơn vị
- **Output**:
  - `p_shift` (cursor): Thông tin ca hiện tại
  - `p_error` (string): Lỗi nếu có

## Quy tắc đặt tên
- Tên SP nên viết hoa, có prefix module (ví dụ: `W_SP_AUTH_`, `W_SP_SHIFT_`)
- Mapping tên SP trong `sp-names.ts` để dễ bảo trì, refactor.

---
Bạn có thể bổ sung thêm script, tài liệu, ví dụ sử dụng cho từng SP tại đây! 