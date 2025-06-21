# Tổng quan dự án EMS

## 1. Mục tiêu ban đầu

Mục tiêu chính là tái cấu trúc ứng dụng EMS (Express Mail Service) để xử lý một yêu cầu nghiệp vụ phức tạp: **khi tìm kiếm bản ghi "E1" không có kết quả, hệ thống cần kích hoạt một tiến trình đồng bộ dữ liệu từ hệ thống cũ trong nền mà không làm người dùng phải chờ đợi**.

Ứng dụng hỗ trợ nghiệp vụ khai thác và đóng gói bưu phẩm, bưu kiện tại các trung tâm khai thác vận chuyển.

## 2. Kiến trúc tổng thể

Dự án được xây dựng dựa trên kiến trúc **Monorepo**, bao gồm 2 phần chính:

*   **`backend`**: Xây dựng bằng **Node.js, Express, TypeScript**. Chịu trách nhiệm xử lý logic nghiệp vụ, giao tiếp với cơ sở dữ liệu Oracle và cung cấp API cho frontend. Đang trong quá trình chuyển đổi sang kiến trúc module hóa DDD.
*   **`frontend`**: Xây dựng bằng **React, TypeScript, Vite, Material-UI (MUI), Zustand, React Query**. Cung cấp giao diện người dùng để tương tác với các tính năng của hệ thống.

## 3. Tiến độ các Module

| Module | Chức năng | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Xác thực & Phân quyền** | Đăng nhập (`login`) | ✅ **Hoàn thành** | Đã chuyển sang cấu trúc module DDD. |
| **Quản lý Ca** | Kiểm tra ca (`shift`) | ✅ **Hoàn thành** | Đã chuyển sang cấu trúc module DDD. |
| **Vận chuyển (`van-chuyen`)** | Tìm kiếm E1 | ✅ **Hoàn thành** | Đã triển khai cơ chế polling chạy nền. |
| | Hiển thị chi tiết E1 | ✅ **Hoàn thành** | |
| | Chi tiết BD10 | ⏳ **Đang triển khai**| |
| **Trung tâm thông báo** | Hiển thị kết quả polling | 🎯 **Sắp triển khai**| Thay thế cho thông báo Toast để cải thiện UX. |

## 4. Các vấn đề quan trọng & Quyết định thiết kế

### 4.1. Vòng lặp API vô tận (Đã khắc phục)
*   **Sự cố:** Đã xảy ra một lỗi nghiêm trọng khi `useEffect` và `useQuery` trong `DeliveryPage.tsx` xung đột, gây ra vòng lặp gọi API tìm kiếm liên tục.
*   **Tác động:** Tăng tải lên DB, nguy cơ "lụt" bảng trigger.
*   **Giải pháp:** Tái cấu trúc lại `DeliveryPage.tsx`, loại bỏ các `useEffect` gây xung đột và chuyển toàn bộ logic xử lý vào trong `onSuccess` callback của `useMutation`.

### 4.2. ID của Job đồng bộ
*   **Vấn đề:** ID ban đầu quá đơn giản, có thể bị trùng lặp.
*   **Giải pháp:** Tạo ID bằng cách `JSON.stringify` một object chứa các tham số tìm kiếm cốt lõi (`fromDate`, `toDate`, `mabcDong`, `mabcNhan`, `chthu`, `tuiso`...). Đảm bảo mỗi lần tìm kiếm với bộ tham số khác nhau sẽ là một job duy nhất.

### 4.3. Trải nghiệm người dùng với thông báo
*   **Vấn đề:** Hiển thị nhiều toast thông báo thành công gây rối và có thể bị người dùng bỏ lỡ.
*   **Giải pháp:** Chuyển từ toast thành công sang mô hình "Trung tâm thông báo" với biểu tượng chuông 🔔. Chỉ sử dụng toast cho các thông báo quan trọng cần chú ý ngay lập tức như lỗi đồng bộ.

## 5. Các lưu ý cần thiết

*   **Middleware Logging (Backend):** Đã triển khai middleware để ghi log tất cả các yêu cầu API, đặc biệt là các cuộc gọi đến Stored Procedure. Điều này rất quan trọng để giám sát và gỡ lỗi các vấn đề về hiệu năng.
*   **Quản lý State (Frontend):** Logic polling và quản lý job được tách biệt hoàn toàn vào store Zustand. Các components chỉ có nhiệm vụ "đọc" state từ store và "ra lệnh" cho store, giúp mã nguồn sạch sẽ và dễ bảo trì.
*   **Bất đồng bộ:** Toàn bộ hệ thống được thiết kế để không chặn người dùng. Họ có thể bắt đầu một quá trình đồng bộ và tiếp tục làm việc khác, kết quả sẽ được thông báo sau.
*   **Bảo mật:** Cần đảm bảo các API được bảo vệ đúng cách (ví dụ: yêu cầu xác thực JWT).

## 6. Các mục tiêu tiếp theo

1.  **Triển khai "Trung tâm thông báo"**: Thay thế hệ thống toast hiện tại bằng một giao diện tập trung, thân thiện hơn với biểu tượng chuông 🔔.
2.  **Di chuyển module `van-chuyen`**: Tái cấu trúc module vận chuyển sang kiến trúc DDD mới để đồng bộ với `auth` và `shift`.
3.  **Hoàn thiện chức năng `Chi tiết BD10`**.
4.  **Tối ưu hóa hiệu năng**: Cải thiện thời gian phản hồi của các API và tối ưu hóa queries database.
5.  **Mở rộng tính năng**: Thêm các chức năng mới cho nghiệp vụ vận chuyển và quản lý bưu phẩm. 