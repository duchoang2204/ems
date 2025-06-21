# Kiến trúc Backend - Hệ thống EMS

## 1. Tổng quan

### 1.1. Công nghệ sử dụng
*   **Nền tảng:** Node.js, Express.js
*   **Ngôn ngữ:** TypeScript
*   **Giao tiếp Database:** `oracledb` package để gọi Stored Procedures.
*   **Dependency Injection:** `tsyringe` để quản lý phụ thuộc và đảo ngược điều khiển (IoC).
*   **Validation:** `joi` để xác thực dữ liệu đầu vào.
*   **Logging:** Middleware tùy chỉnh để ghi log chi tiết các request/response.

### 1.2. Cấu trúc thư mục (Kiến trúc Module hóa DDD)

Dự án đang trong quá trình chuyển đổi sang kiến trúc hướng module, nơi mỗi chức năng nghiệp vụ lớn được đóng gói thành một module độc lập.

**Cấu trúc mới (đích đến) nằm trong `backend/src/modules/`:**

```
src/
├── app.ts                 # Cấu hình Express, middleware
├── server.ts              # Khởi động server
├── modules/               # **Nơi chứa các module nghiệp vụ**
│   ├── auth/              # Module xác thực (✅ Đã di chuyển)
│   ├── shift/             # Module quản lý ca (✅ Đã di chuyển)
│   └── van-chuyen/        # Module vận chuyển (⏳ Đang phát triển)
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       └── types/
├── config/                # Các file cấu hình (database, constants)
├── middleware/            # Express middleware (logging, error handling)
└── types/                 # Các type dùng chung toàn cục
```

## 2. Logic xử lý Stored Procedures

### 2.1. Tập trung logic vào Database
*   Toàn bộ logic tìm kiếm và kích hoạt đồng bộ được đóng gói trong Stored Procedure (SP) của Oracle: `W_WEB.SEARCH_E1`.
*   **Tham số SP:**
    *   `IN`: Các tham số tìm kiếm (ngày, chuyến, bưu cục...).
    *   `OUT p_status`: Trạng thái kết quả (`SUCCESS`, `PENDING`, `FAILED`).
    *   `OUT p_job_id`: ID duy nhất cho yêu cầu tìm kiếm (quan trọng khi `p_status` là `PENDING`).
    *   `OUT p_cursor`: Con trỏ `SYS_REFCURSOR` chứa dữ liệu kết quả nếu tìm thấy.

### 2.2. Luồng hoạt động của SP `W_WEB.SEARCH_E1`
1.  Thực hiện tìm kiếm bản ghi E1 trên các bảng nội bộ và thông qua các DBLink (`@EMSHCM`, `@EMSHNNT`).
2.  **Nếu không tìm thấy**, procedure sẽ kiểm tra tiếp trong bảng `kpi_postbag_bccp` để xem có thể thực hiện đồng bộ hay không.
3.  **Nếu có thể đồng bộ**, procedure sẽ thực hiện một lệnh `INSERT` hoặc `UPDATE` vào bảng trigger `bccp_mailtriptoget_hktv` để ra hiệu cho một hệ thống khác bắt đầu quá trình đồng bộ dữ liệu.
4.  Trong trường hợp này, procedure sẽ trả về `p_status = 'PENDING'` và một `p_job_id` để backend và frontend theo dõi.
5.  Nếu tìm thấy dữ liệu ngay từ bước 1, procedure trả về `p_status = 'SUCCESS'` và dữ liệu trong `p_cursor`.

## 3. API Endpoints

### 3.1. Endpoint chính
*   **`POST /api/van-chuyen/search`**: Endpoint chính để bắt đầu một phiên tìm kiếm.
    *   **Body:** Chứa các tham số tìm kiếm (`fromDate`, `toDate`, `chthu`, `tuiso`...).
    *   **Response:**
        *   Nếu SP trả về dữ liệu (`p_cursor` có kết quả):
            ```json
            { "status": "SUCCESS", "data": [...] }
            ```
        *   Nếu SP không trả về dữ liệu nhưng cờ `p_status` là `PENDING`:
            ```json
            { "status": "PENDING", "jobId": "unique_job_id", "message": "Đang đồng bộ dữ liệu..." }
            ```
        *   Nếu không tìm thấy và không kích hoạt đồng bộ:
             ```json
            { "status": "FAILED", "message": "Không tìm thấy dữ liệu." }
            ```

### 3.2. Endpoint polling
*   **`GET /api/van-chuyen/result/:jobId`**: Endpoint được frontend gọi lặp lại (polling) để kiểm tra kết quả.
    *   **Params:** `:jobId` là ID được trả về từ endpoint `/search`.
    *   **Response:** Tương tự endpoint `/search`, nhưng được gọi bởi cơ chế polling.

## 4. Luồng xử lý API chi tiết

### 4.1. Tìm kiếm ban đầu
1.  **Request:** Frontend gửi yêu cầu tìm kiếm đến `POST /api/van-chuyen/search`.
2.  **Middleware:** Request đi qua `loggingMiddleware` để ghi log chi tiết.
3.  **Controller:** `VanChuyenController` nhận request, xác thực body bằng `joi`.
4.  **Service:**
    *   `VanChuyenService` được inject vào controller.
    *   Service gọi Stored Procedure `W_WEB.SEARCH_E1` với các tham số tìm kiếm.
5.  **Repository (trong Service):**
    *   Lớp Repository chịu trách nhiệm kết nối DB và thực thi procedure.
    *   Nó nhận kết quả trả về từ `SEARCH_E1`, bao gồm `status`, `job_id` (nếu có), và `cursor` (nếu có dữ liệu).
6.  **Response to Frontend:** Service đóng gói kết quả và trả về cho Controller, sau đó gửi về cho Frontend.

### 4.2. Polling process
*   Nếu Frontend nhận `status: 'PENDING'`, nó bắt đầu gọi `GET /api/van-chuyen/result/:jobId`.
*   Với mỗi yêu cầu polling, `VanChuyenService` sẽ gọi procedure `W_WEB.GET_E1_BY_ID` với `jobId` tương ứng.
*   Quá trình này lặp lại cho đến khi procedure trả về `status: 'SUCCESS'` hoặc `status: 'FAILED'`.

## 5. Dependency Injection với `tsyringe`

`tsyringe` là trọng tâm của kiến trúc module.

*   Mỗi module (ví dụ: `van-chuyen`) sẽ có một file container riêng để đăng ký các dependency của nó (Service, Repository).
*   Các class được đánh dấu bằng decorator `@injectable()`.
*   Việc phụ thuộc được khai báo trong constructor với decorator `@inject('Token')`.
*   Controller sẽ resolve Service từ container để sử dụng.

**Ví dụ trong `VanChuyenController`:**
```typescript
@injectable()
export class VanChuyenController {
  constructor(
    @inject('IVanChuyenService') private vanChuyenService: IVanChuyenService
  ) {}

  public search = async (req: Request, res: Response) => {
    try {
      // Validate input
      const { error, value } = searchSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Call service
      const result = await this.vanChuyenService.searchE1(value);
      
      // Return response
      return res.json(result);
    } catch (error) {
      console.error('Search error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
```

## 6. Middleware Logging

Đã triển khai middleware tùy chỉnh để ghi log chi tiết:

```typescript
// middleware/logging.middleware.ts
export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
    body: req.body,
    params: req.params,
    query: req.query
  });

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};
```

## 7. Error Handling

### 7.1. Stored Procedure Errors
*   Xử lý các lỗi Oracle cụ thể (ORA-06550, ORA-00942, etc.)
*   Log chi tiết các lỗi để debug
*   Trả về thông báo lỗi thân thiện cho frontend

### 7.2. Validation Errors
*   Sử dụng Joi để validate input parameters
*   Trả về lỗi 400 với thông báo chi tiết

### 7.3. Database Connection Errors
*   Xử lý lỗi kết nối database
*   Retry logic cho các lỗi tạm thời

## 8. Các lưu ý quan trọng

*   **Resource Management:** Đảm bảo đóng cursor và connection trong `finally` block
*   **Type Safety:** Sử dụng TypeScript với type assertion cho `outBinds`
*   **Input Validation:** Validate tất cả input parameters trước khi gọi SP
*   **Logging:** Log đầy đủ thông tin để debug khi cần thiết
*   **Error Handling:** Xử lý từng loại Oracle error cụ thể thay vì catch chung
*   **Performance:** Sử dụng connection pooling để tối ưu hiệu năng
*   **Security:** Đảm bảo các API được bảo vệ đúng cách (JWT authentication)

## 9. Kế hoạch phát triển

1.  **Hoàn thiện module `van-chuyen`**: Chuyển đổi sang kiến trúc DDD hoàn chỉnh
2.  **Tối ưu hóa Stored Procedures**: Cải thiện hiệu năng của các SP
3.  **Mở rộng API**: Thêm các endpoint mới cho nghiệp vụ vận chuyển
4.  **Monitoring & Alerting**: Triển khai hệ thống giám sát và cảnh báo
5.  **Testing**: Tăng cường unit tests và integration tests 