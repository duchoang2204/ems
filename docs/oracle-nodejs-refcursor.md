# Lưu ý khi làm việc với REF CURSOR (ResultSet) trong Node.js/oracledb và Oracle

## Checklist lỗi phổ biến & cách xử lý chuẩn
1. ❌ Truy cập REF CURSOR như mảng → ✅ Dùng getRow/getRows()
2. ❌ Không đóng ResultSet → ✅ rs.close()
3. ❌ Sai kiểu BIND → ✅ Kiểm tra kỹ STRING/NUMBER/CURSOR + BIND_IN/BIND_OUT
4. ❌ Thiếu maxSize với STRING OUT → ✅ maxSize ≥ độ dài chuỗi
5. ❌ Không kiểm tra null/undefined → ✅ if (!row) return null;
6. ❌ Quên conn.close() → ✅ Dùng finally
7. ❌ Thiếu autoCommit → ✅ commit thủ công hoặc autoCommit: true
8. ❌ Không bắt lỗi chi tiết → ✅ Log error.message/code
9. ❌ Không kiểm tra metaData của ResultSet → ✅ Kiểm tra resultSet.metaData để mapping đúng
10. ❌ Không xử lý hết tất cả dòng khi dùng getRows(n) → ✅ Lặp qua toàn bộ mảng, luôn đóng ResultSet
11. ❌ Không xử lý lỗi khi close ResultSet/connection → ✅ Dùng try/catch/finally
12. ❌ Không kiểm tra transaction/rollback khi cần → ✅ rollback khi có lỗi
13. ❌ Không log đầu vào/ra khi debug → ✅ Log tham số, outBinds, metaData khi cần

## 1. REF CURSOR trả về từ stored procedure là gì?
- Khi Oracle stored procedure trả về OUT SYS_REFCURSOR, Node.js/oracledb sẽ nhận được một đối tượng ResultSet, KHÔNG phải là mảng dữ liệu.

## 2. Cách lấy dữ liệu đúng từ ResultSet
- Phải dùng `resultSet.getRow()` để lấy 1 dòng, hoặc `resultSet.getRows(n)` để lấy nhiều dòng.
- Sau khi lấy dữ liệu, LUÔN phải gọi `resultSet.close()` để giải phóng tài nguyên.
- Có thể kiểm tra `resultSet.metaData` để biết tên cột, mapping đúng khi lấy nhiều dòng.

## 3. Lỗi phổ biến
- Truy cập trực tiếp `result.outBinds.p_user[0]` hoặc `[i]` sẽ luôn bị lỗi hoặc undefined.
- Không đóng ResultSet sẽ gây leak connection.
- Không truyền đúng maxSize cho STRING OUT dễ bị lỗi khi trả về chuỗi dài.
- Không kiểm tra null/undefined khi lấy row.
- Không xử lý hết các dòng khi dùng getRows(n).

## 4. Ví dụ chuẩn
```typescript
const result = await conn.execute(
  `BEGIN MY_SP(:p_cursor, :p_error); END;`,
  {
    p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
    p_error: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
  }
);
const outBinds = result.outBinds as { [key: string]: any };
if (outBinds.p_error) throw new Error(outBinds.p_error);
const resultSet = outBinds.p_cursor as oracledb.ResultSet<any>;
const row = await resultSet.getRow();
await resultSet.close();
```

### Ví dụ lấy nhiều dòng
```typescript
const rows = await resultSet.getRows(100); // lấy tối đa 100 dòng
for (const row of rows) {
  // Xử lý từng dòng
}
await resultSet.close();
```

## 5. Lưu ý về encoding/NLS
- Nếu gặp lỗi ký tự lạ, kiểm tra NLS_CHARACTERSET của session và DB.
- Đảm bảo client và server cùng encoding (UTF-8 là an toàn nhất).

## 6. Tổng kết
- Luôn dùng getRow/getRows với ResultSet.
- Luôn đóng ResultSet.
- Không truy cập trực tiếp như mảng.
- Kiểm tra metaData khi mapping nhiều dòng.
- Luôn xử lý lỗi khi close ResultSet/connection.
- Log kỹ khi debug lỗi khó.
- Đọc kỹ tài liệu oracledb về REF CURSOR: https://oracle.github.io/node-oracledb/doc/api.html#resultsetclass 