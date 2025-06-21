# Tóm Tắt Toàn Diện Dự Án EMS

## 1. Mục Tiêu Ban Đầu

Mục tiêu chính là tái cấu trúc ứng dụng EMS (Express Mail Service) để xử lý một yêu cầu nghiệp vụ phức tạp: khi tìm kiếm bản ghi "E1" không có kết quả, hệ thống cần kích hoạt một tiến trình đồng bộ dữ liệu từ hệ thống cũ trong nền mà không làm người dùng phải chờ đợi. 

Ứng dụng bao gồm:
*   **Frontend:** React, TypeScript, Vite, Material-UI (MUI), Zustand, React Query.
*   **Backend:** Node.js, Express, TypeScript, OracleDB.

---

## 2. Kiến Trúc & Luồng Xử Lý

### 2.1. Backend (Node.js & Oracle)

#### Cấu trúc thư mục (dự kiến):
```
backend/
└── src/
    ├── config/         # Cấu hình (DB, server...)
    ├── constants/      # Các hằng số (tên SP, lỗi...)
    ├── middleware/     # Middleware (xử lý lỗi, logging...)
    ├── modules/        # Nơi chứa logic nghiệp vụ chính
    │   └── e1/
    │       ├── e1.controller.ts
    │       ├── e1.service.ts
    │       └── e1.repository.ts
    ├── services/       # Các service dùng chung
    ├── utils/          # Các hàm tiện ích
    └── server.ts       # Điểm khởi đầu của server
```

#### Logic xử lý:
1.  **Tập trung logic vào Database:**
    *   Toàn bộ logic tìm kiếm và kích hoạt đồng bộ được đóng gói trong Stored Procedure (SP) của Oracle: `W_WEB.SEARCH_E1`.
    *   **Tham số SP:**
        *   `IN`: Các tham số tìm kiếm (ngày, chuyến, bưu cục...).
        *   `OUT p_sync_triggered`: Cờ (0 hoặc 1) để báo cho backend biết liệu quá trình đồng bộ có được kích hoạt hay không.
        *   `OUT p_ref_cursor`: Con trỏ trả về kết quả nếu tìm thấy.
    *   **Luồng hoạt động của SP:**
        1.  Tìm kiếm dữ liệu E1 trên các bảng nội bộ và qua DBLink (`@EMSHCM`, `@EMSHNNT`).
        2.  Nếu **không tìm thấy**, kiểm tra bảng `kpi_postbag_bccp`.
        3.  Nếu có bản ghi trong bảng KPI, SP sẽ `INSERT` hoặc `UPDATE` vào bảng trigger `bccp_mailtriptoget_hktv`.
        4.  Đặt cờ `p_sync_triggered` thành `1`.

2.  **API Endpoint (`/api/e1/search`):**
    *   Controller nhận yêu cầu từ frontend.
    *   Service gọi SP `W_WEB.SEARCH_E1` với các tham số nhận được.
    *   **Định dạng phản hồi (Response):**
        *   Nếu SP trả về dữ liệu (`p_ref_cursor` có kết quả):
            ```json
            { "status": "SUCCESS", "data": [...] }
            ```
        *   Nếu SP không trả về dữ liệu nhưng cờ `p_sync_triggered` là `1`:
            ```json
            { "status": "PENDING", "message": "Đang đồng bộ dữ liệu..." }
            ```
        *   Nếu không tìm thấy và không kích hoạt đồng bộ:
             ```json
            { "status": "FAILED", "message": "Không tìm thấy dữ liệu." }
            ```

---

### 2.2. Frontend (React)

#### Cấu trúc thư mục (dự kiến):
```
frontend/
└── src/
    ├── api/                # Các hàm gọi API (axios)
    ├── components/         # Components tái sử dụng (Header, NotificationBell...)
    ├── context/            # React Context (AuthContext...)
    ├── features/           # Các tính năng lớn (ví dụ: Vận chuyển)
    │   └── van-chuyen/
    │       ├── components/ # Components riêng của tính năng
    │       ├── hooks/      # Hooks riêng
    │       └── DeliveryPage.tsx
    ├── hooks/              # Hooks chung (usePageTitle...)
    ├── stores/             # Global state (Zustand)
    │   └── backgroundJobsStore.ts
    ├── App.tsx
    └── main.tsx
```

#### Logic xử lý & Trải nghiệm người dùng (UX):
1.  **Tìm kiếm ban đầu:**
    *   Người dùng nhập thông tin và nhấn nút "Tìm kiếm" trên `DeliveryPage.tsx`.
    *   Sử dụng `useMutation` của React Query để gọi API `/api/e1/search`.

2.  **Xử lý phản hồi từ API:**
    *   **`onSuccess` callback của `useMutation`:**
        *   Nếu `response.status === 'SUCCESS'`: Hiển thị dữ liệu trong bảng như bình thường.
        *   Nếu `response.status === 'PENDING'`:
            1.  Hiển thị một thông báo toast (ví dụ: "Không tìm thấy dữ liệu, đang tiến hành đồng bộ từ hệ thống cũ...").
            2.  Gọi hàm `startJob` từ store Zustand `useBackgroundJobsStore`.

3.  **Hệ thống Polling và Thông báo trong nền (Zustand - `backgroundJobsStore.ts`):**
    *   `startJob(params)`:
        *   Tạo một `jobId` duy nhất từ các tham số tìm kiếm.
        *   Thêm một job mới vào state với `status: 'polling'`.
        *   Bắt đầu quá trình polling: gọi API `/api/e1/search` (với một flag `isPolling: true` để backend biết đây là cuộc gọi polling) mỗi 5 giây, trong tối đa 30 giây (6 lần thử).
    *   **Khi Polling hoàn tất:**
        *   **Thành công:** Cập nhật job trong store thành `status: 'success'` và lưu dữ liệu trả về.
        *   **Thất bại:** Cập nhật job thành `status: 'failed'` và lưu thông báo lỗi.

4.  **Trung tâm thông báo (`NotificationBell.tsx`):**
    *   Component này nằm ở `Header.tsx`.
    *   Lắng nghe sự thay đổi của các jobs trong `backgroundJobsStore`.
    *   Khi có một job chuyển sang `status: 'success'` và chưa được đọc (`read: false`), một huy hiệu (badge) sẽ hiển thị trên biểu tượng chuông 🔔.
    *   Khi người dùng nhấp vào chuông, một menu (dropdown) sẽ hiển thị danh sách các kết quả đã đồng bộ thành công.
    *   Nhấp vào một kết quả trong danh sách sẽ kích hoạt `setJobToView(job)` và `markJobAsRead(job.id)`.

5.  **Hiển thị lại kết quả (`DeliveryPage.tsx`):**
    *   Một `useEffect` lắng nghe sự thay đổi của `jobToView` trong store.
    *   Khi `jobToView` có giá trị, trang sẽ:
        1.  Tự động điền lại các ô input với thông tin từ `jobToView.params`.
        2.  Hiển thị dữ liệu từ `jobToView.data` vào bảng kết quả.
        3.  Reset `jobToView` về `null` bằng `clearViewedJob()` để tránh lặp lại.

---

## 3. Các Vấn Đề Quan Trọng & Quyết Định Thiết Kế

1.  **Vòng lặp API vô tận:**
    *   **Sự cố:** Đã xảy ra một lỗi nghiêm trọng khi `useEffect` và `useQuery` trong `DeliveryPage.tsx` xung đột, gây ra vòng lặp gọi API tìm kiếm liên tục.
    *   **Tác động:** Tăng tải lên DB, nguy cơ "lụt" bảng trigger.
    *   **Giải pháp:** Tái cấu trúc lại `DeliveryPage.tsx`, loại bỏ các `useEffect` gây xung đột và chuyển toàn bộ logic xử lý (hiển thị dữ liệu, bắt đầu job) vào trong `onSuccess` callback của `useMutation`.

2.  **ID của Job đồng bộ:**
    *   **Vấn đề:** ID ban đầu quá đơn giản, có thể bị trùng lặp.
    *   **Giải pháp:** Tạo ID bằng cách `JSON.stringify` một object chứa các tham số tìm kiếm cốt lõi (`fromDate`, `toDate`, `mabcDong`, `mabcNhan`, `chthu`, `tuiso`...). Điều này đảm bảo mỗi lần tìm kiếm với bộ tham số khác nhau sẽ là một job duy nhất.

3.  **Trải nghiệm người dùng với thông báo:**
    *   **Vấn đề:** Hiển thị nhiều toast thông báo thành công gây rối và có thể bị người dùng bỏ lỡ.
    *   **Giải pháp:** Chuyển từ toast thành công sang mô hình "Trung tâm thông báo" với biểu tượng chuông 🔔. Chỉ sử dụng toast cho các thông báo quan trọng cần chú ý ngay lập tức như lỗi đồng bộ.

---

## 4. Các Lưu Ý Cần Thiết

*   **Middleware Logging (Backend):** Cần thêm một middleware để ghi log tất cả các yêu cầu API, đặc biệt là các cuộc gọi đến SP. Điều này rất quan trọng để giám sát và gỡ lỗi các vấn đề về hiệu năng trong tương lai.
*   **Quản lý State (Frontend):** Logic polling và quản lý job được tách biệt hoàn toàn vào store Zustand. Các components chỉ có nhiệm vụ "đọc" state từ store và "ra lệnh" cho store, giúp mã nguồn sạch sẽ và dễ bảo trì.
*   **Bất đồng bộ:** Toàn bộ hệ thống được thiết kế để không chặn người dùng. Họ có thể bắt đầu một quá trình đồng bộ và tiếp tục làm việc khác, kết quả sẽ được thông báo sau.
*   **Bảo mật:** Cần đảm bảo các API được bảo vệ đúng cách (ví dụ: yêu cầu xác thực JWT).

---

## 5. Tài Liệu Chi Tiết

Để có thông tin chi tiết và đầy đủ về dự án, vui lòng tham khảo các tài liệu trong thư mục `docs/`:

### 📚 Tài Liệu Chính
- **[PROJECT_OVERVIEW.md](./docs/PROJECT_OVERVIEW.md)** - Tổng quan toàn diện về dự án
- **[DATABASE_ARCHITECTURE.md](./docs/DATABASE_ARCHITECTURE.md)** - Kiến trúc database và Stored Procedures
- **[BACKEND_ARCHITECTURE.md](./docs/BACKEND_ARCHITECTURE.md)** - Kiến trúc backend Node.js
- **[FRONTEND_ARCHITECTURE.md](./docs/FRONTEND_ARCHITECTURE.md)** - Kiến trúc frontend React

### 🎯 Hướng Dẫn Sử Dụng
- **[docs/README.md](./docs/README.md)** - Hướng dẫn sử dụng tài liệu và quy trình cập nhật

### 📋 Nội Dung Chi Tiết
Các tài liệu trên bao gồm:
- **Code examples** chi tiết cho từng component
- **API documentation** đầy đủ
- **Database schema** và stored procedures
- **Error handling** và validation
- **Performance optimization** techniques
- **Deployment** guidelines

---
*Tài liệu này được tạo vào ngày ${new Date().toLocaleDateString('vi-VN')} để tổng kết tiến trình dự án.*

**Lưu ý**: Tài liệu chi tiết đã được tạo trong thư mục `docs/` để AI mới có thể hiểu và làm việc hiệu quả với dự án mà không cần giải thích lại từ đầu. 