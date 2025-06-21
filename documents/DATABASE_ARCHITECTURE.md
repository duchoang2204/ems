# Kiến trúc Database - Hệ thống EMS

## 1. Tổng quan

Cơ sở dữ liệu của dự án là **Oracle Database**. Logic nghiệp vụ cốt lõi được xử lý thông qua các **Stored Procedures** được đóng gói trong package `W_WEB`. Ứng dụng không giao tiếp trực tiếp với bảng mà thông qua các Procedure này.

## 2. Package `W_WEB`

### 2.1. Danh sách Stored Procedure đang dùng

| Tên Procedure | Module | Mục đích |
| :--- | :--- | :--- |
| `LOGIN` | Xác thực | Xử lý đăng nhập, trả về thông tin người dùng và token. |
| `CHECK_CURRENT_SHIFT` | Quản lý Ca | Kiểm tra ca làm việc hiện tại của người dùng. |
| `SEARCH_E1` | Vận chuyển | Tìm kiếm E1. Nếu không tìm thấy, có thể kích hoạt đồng bộ và trả về trạng thái `PENDING`. |
| `GET_E1_BY_ID` | Vận chuyển | Được sử dụng bởi cơ chế polling để kiểm tra kết quả của một job đã được kích hoạt đồng bộ. |

### 2.2. Chi tiết Stored Procedure `SEARCH_E1`

Đây là procedure phức tạp và quan trọng nhất trong luồng nghiệp vụ vận chuyển.

*   **Input:** Các tham số tìm kiếm (`p_fromDate`, `p_toDate`, `p_chthu`...), tham số phân trang.
*   **Output:**
    *   `p_cursor`: Con trỏ `SYS_REFCURSOR` chứa dữ liệu kết quả nếu tìm thấy.
    *   `p_job_id`: Một ID duy nhất cho yêu cầu tìm kiếm (quan trọng khi `p_status` là `PENDING`).
    *   `p_status`: Trạng thái kết quả (`SUCCESS`, `PENDING`, `FAILED`).
*   **Luồng xử lý nội bộ của Procedure:**
    1.  Thực hiện tìm kiếm bản ghi E1 trên các bảng nội bộ và thông qua các DBLink (`@EMSHCM`, `@EMSHNNT`).
    2.  **Nếu không tìm thấy**, procedure sẽ kiểm tra tiếp trong bảng `kpi_postbag_bccp` để xem có thể thực hiện đồng bộ hay không.
    3.  **Nếu có thể đồng bộ**, procedure sẽ thực hiện một lệnh `INSERT` hoặc `UPDATE` vào bảng trigger `bccp_mailtriptoget_hktv` để ra hiệu cho một hệ thống khác bắt đầu quá trình đồng bộ dữ liệu.
    4.  Trong trường hợp này, procedure sẽ trả về `p_status = 'PENDING'` và một `p_job_id` để backend và frontend theo dõi.
    5.  Nếu tìm thấy dữ liệu ngay từ bước 1, procedure trả về `p_status = 'SUCCESS'` và dữ liệu trong `p_cursor`.

## 3. Luồng dữ liệu tổng thể (Nghiệp vụ Tìm kiếm E1)

1.  **Frontend** gọi API `/api/van-chuyen/search` với các tham số tìm kiếm.
2.  **Backend** gọi procedure `W_WEB.SEARCH_E1`.
3.  **Oracle DB** thực thi logic trong `SEARCH_E1` và trả về `status` ('SUCCESS', 'PENDING', hoặc 'FAILED') cùng với `job_id` nếu cần.
4.  **Frontend** nhận kết quả:
    *   Nếu là `SUCCESS`: Hiển thị dữ liệu.
    *   Nếu là `PENDING`: Bắt đầu tác vụ polling, định kỳ gọi API `/api/van-chuyen/result/:job_id`.
5.  API `/api/van-chuyen/result/:job_id` ở **Backend** sẽ gọi procedure `W_WEB.GET_E1_BY_ID` với `job_id` tương ứng để kiểm tra tiến trình.
6.  Khi `GET_E1_BY_ID` trả về `status` cuối cùng, vòng lặp polling kết thúc và **Frontend** thông báo cho người dùng.

## Phụ lục: 14 Lỗi Oracle Thường Gặp Cần Lưu Ý

Dưới đây là danh sách các lỗi phổ biến mà lập trình viên có thể gặp phải khi làm việc với Oracle Database và Stored Procedures thông qua `node-oracledb`, cùng với nguyên nhân và cách khắc phục.

| # | Vấn đề | Hướng xử lý |
|---|--------|-------------|
| 1 | Không ép kiểu `outBinds` | `as { outBinds: { p_user, p_error } }` |
| 2 | Không kiểm tra `cursor === null` | `if (!cursor) throw new Error()` |
| 3 | Không `getRows()` → SP return cursor nhưng không đọc | Luôn gọi `const rows = await cursor.getRows()` |
| 4 | Không `await cursor.close()` sau khi `getRows()` | Đảm bảo đóng cursor trong `finally` block |
| 5 | Không kiểm tra `rows.length === 0` | Xử lý trường hợp không có dữ liệu trả về |
| 6 | Không bắt `try/catch` quanh `execute()` | Luôn wrap SP calls trong try-catch |
| 7 | Không log `params`, `outBinds`, `metaData` khi debug | Log đầy đủ thông tin để debug |
| 8 | Không xử lý rõ lỗi `ORA-...` (ví dụ `ORA-06550`) | Xử lý từng loại Oracle error cụ thể |
| 9 | Dùng `conn` sau khi `finally conn.close()` | Không sử dụng connection sau khi đã đóng |
| 10 | Không check `g_mabc` trước khi gọi SP | Validate input parameters trước khi gọi SP |
| 11 | Dùng sai `type` trong `BIND_OUT` (`STRING` vs `CURSOR`) | Đảm bảo type binding đúng với SP signature |
| 12 | Trả `undefined` ra FE nếu rows rỗng → FE crash | Luôn trả về array rỗng `[]` thay vì `undefined` |
| 13 | Không kiểm tra `error !== null` trong `outBinds.p_error` | Kiểm tra error từ SP trước khi xử lý kết quả |
| 14 | Gọi sai SP hoặc truyền thiếu biến (Oracle silent error) | Double-check SP name và parameter list |

### Ví dụ Code Mẫu

```typescript
// ❌ Code sai - thiếu nhiều kiểm tra
const result = await connection.execute(
  'BEGIN W_WEB.SEARCH_E1(:p_fromDate, :p_cursor); END;',
  { p_fromDate: fromDate, p_cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } }
);
return result.outBinds.p_cursor;

// ✅ Code đúng - đầy đủ kiểm tra
try {
  // Validate input
  if (!g_mabc) {
    throw new Error('Mã bưu cục không được để trống');
  }

  const result = await connection.execute(
    'BEGIN W_WEB.SEARCH_E1(:p_fromDate, :p_toDate, :p_mabc, :p_cursor, :p_status, :p_job_id); END;',
    {
      p_fromDate: fromDate,
      p_toDate: toDate,
      p_mabc: g_mabc,
      p_cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      p_status: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 10 },
      p_job_id: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 50 }
    }
  ) as { outBinds: { p_cursor: any; p_status: string; p_job_id: string } };

  // Log để debug
  console.log('SP Result:', {
    params: { fromDate, toDate, g_mabc },
    outBinds: result.outBinds,
    metaData: result.metaData
  });

  const cursor = result.outBinds.p_cursor;
  const status = result.outBinds.p_status;
  const jobId = result.outBinds.p_job_id;

  // Kiểm tra cursor
  if (!cursor) {
    throw new Error('Stored Procedure không trả về cursor');
  }

  // Đọc dữ liệu từ cursor
  const rows = await cursor.getRows();
  
  // Đóng cursor
  await cursor.close();

  // Xử lý kết quả
  if (rows.length === 0) {
    return { status, jobId, data: [] }; // Trả về array rỗng thay vì undefined
  }

  return { status, jobId, data: rows };

} catch (error) {
  // Xử lý lỗi Oracle cụ thể
  if (error.code === 'ORA-06550') {
    console.error('Lỗi PL/SQL:', error.message);
    throw new Error('Lỗi thực thi Stored Procedure');
  }
  
  if (error.code === 'ORA-00942') {
    console.error('Bảng không tồn tại:', error.message);
    throw new Error('Bảng dữ liệu không tồn tại');
  }

  console.error('Lỗi database:', error);
  throw error;
} finally {
  // Đảm bảo connection được đóng
  if (connection) {
    await connection.close();
  }
}
```

### Các Lưu Ý Quan Trọng

1. **Type Safety**: Luôn sử dụng TypeScript với type assertion cho `outBinds`
2. **Resource Management**: Đảm bảo đóng cursor và connection trong `finally` block
3. **Error Handling**: Xử lý từng loại Oracle error cụ thể thay vì catch chung
4. **Input Validation**: Validate tất cả input parameters trước khi gọi SP
5. **Logging**: Log đầy đủ thông tin để debug khi cần thiết
6. **Null Safety**: Luôn kiểm tra null/undefined trước khi sử dụng
7. **Return Consistency**: Luôn trả về cùng format dữ liệu, kể cả khi rỗng 