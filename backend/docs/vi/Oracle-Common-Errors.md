# Lỗi Oracle Thường Gặp và Cách Xử Lý

## 1. Lỗi khi làm việc với Stored Procedure

### 1.1. Lỗi về Cursor
```typescript
// ❌ Sai: Không kiểm tra cursor null
const cursor = result.outBinds.p_cursor;
const rows = await cursor.getRows();

// ✅ Đúng: Kiểm tra cursor null
const cursor = result.outBinds?.p_cursor;
if (!cursor) throw new Error('Cursor không tồn tại');
const rows = await cursor.getRows();
```

### 1.2. Lỗi về OutBinds
```typescript
// ❌ Sai: Không ép kiểu outBinds
const error = result.outBinds.p_error;

// ✅ Đúng: Ép kiểu outBinds
type OutBinds = { p_error: string; p_data: oracledb.ResultSet<any> };
const error = (result.outBinds as OutBinds)?.p_error;
```

### 1.3. Lỗi Resource Leak
```typescript
// ❌ Sai: Không đóng cursor
const rows = await cursor.getRows();
return rows;

// ✅ Đúng: Đóng cursor sau khi dùng xong
const rows = await cursor.getRows();
await cursor.close();
return rows;
```

## 2. Lỗi Connection Management

### 2.1. Connection Leak
```typescript
// ❌ Sai: Không đóng connection
const conn = await getOracleConnection();
const result = await conn.execute(query);
return result;

// ✅ Đúng: Đóng connection trong finally
let conn;
try {
  conn = await getOracleConnection();
  const result = await conn.execute(query);
  return result;
} finally {
  if (conn) await conn.close();
}
```

### 2.2. Connection Pool Exhaustion
```typescript
// ❌ Sai: Mở nhiều connection mà không đóng
async function badFunction() {
  const conn1 = await getOracleConnection();
  const conn2 = await getOracleConnection();
  // ... code
}

// ✅ Đúng: Đóng connection ngay khi không cần nữa
async function goodFunction() {
  let conn1, conn2;
  try {
    conn1 = await getOracleConnection();
    // ... use conn1
    await conn1.close();
    
    conn2 = await getOracleConnection();
    // ... use conn2
  } finally {
    if (conn2) await conn2.close();
  }
}
```

## 3. Lỗi về Data Types

### 3.1. NUMBER vs VARCHAR2
```typescript
// ❌ Sai: Không chuyển đổi kiểu dữ liệu
await conn.execute('SELECT * FROM users WHERE id = :id', { id: '123' });

// ✅ Đúng: Chuyển đổi kiểu dữ liệu phù hợp
await conn.execute('SELECT * FROM users WHERE id = :id', { id: Number('123') });
```

### 3.2. DATE Handling
```typescript
// ❌ Sai: Gửi JavaScript Date trực tiếp
const date = new Date();
await conn.execute('INSERT INTO logs (log_date) VALUES (:date)', { date });

// ✅ Đúng: Chuyển đổi sang định dạng Oracle chấp nhận
const date = new Date();
await conn.execute('INSERT INTO logs (log_date) VALUES (TO_DATE(:date, \'YYYY-MM-DD HH24:MI:SS\'))', 
  { date: date.toISOString().slice(0, 19).replace('T', ' ') }
);
```

## 4. Best Practices

### 4.1. Error Handling
```typescript
try {
  // ... code
} catch (err: any) {
  // Xử lý các lỗi Oracle cụ thể
  if (err.message.includes('ORA-00001')) {
    throw new Error('Duplicate key violation');
  }
  if (err.message.includes('ORA-01017')) {
    throw new Error('Invalid username/password');
  }
  // Log error để debug
  console.error(`[Oracle Error] ${err.message}`);
  throw new Error('Database error occurred');
}
```

### 4.2. Bind Variables
```typescript
// ❌ Sai: SQL Injection risk
await conn.execute(`SELECT * FROM users WHERE username = '${username}'`);

// ✅ Đúng: Sử dụng bind variables
await conn.execute('SELECT * FROM users WHERE username = :username', { username });
```

### 4.3. Batch Operations
```typescript
// ❌ Sai: Nhiều lần execute riêng lẻ
for (const item of items) {
  await conn.execute(INSERT_QUERY, item);
}

// ✅ Đúng: Sử dụng executeMany
await conn.executeMany(INSERT_QUERY, items);
```

## 5. Mã Lỗi Oracle Thường Gặp

| Mã lỗi | Mô tả | Cách xử lý |
|---------|---------|------------|
| ORA-00001 | Unique constraint violated | Kiểm tra dữ liệu trùng lặp |
| ORA-01017 | Invalid username/password | Kiểm tra credentials |
| ORA-12170 | Connect timeout | Kiểm tra network/firewall |
| ORA-12541 | No listener | Kiểm tra service name và listener |
| ORA-12545 | Connect failed | Kiểm tra database availability |
| ORA-01400 | Cannot insert NULL | Kiểm tra required fields |
| ORA-00904 | Invalid column name | Kiểm tra tên cột trong query |
| ORA-00936 | Missing expression | Kiểm tra syntax của query |
| ORA-00942 | Table or view does not exist | Kiểm tra tên bảng/view |
| ORA-06550 | PL/SQL error | Kiểm tra syntax của PL/SQL block |

## 6. Tips & Tricks

1. Luôn sử dụng try-catch-finally khi làm việc với connection
2. Log đầy đủ thông tin để debug (params, error message, stack trace)
3. Sử dụng connection pool thay vì tạo connection mới
4. Đóng tất cả resources (connection, cursor) sau khi dùng xong
5. Sử dụng bind variables để tránh SQL injection
6. Kiểm tra null cho tất cả các outBinds
7. Xử lý timeout cho các operations có thể mất nhiều thời gian
8. Implement retry mechanism cho các lỗi tạm thời
9. Maintain một danh sách các stored procedures với params
10. Document rõ ràng các error cases và cách xử lý 