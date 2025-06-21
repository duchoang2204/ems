# Kiến trúc Frontend - Hệ thống EMS

## 1. Tổng quan

### 1.1. Công nghệ sử dụng
*   **Framework:** React (với Vite)
*   **Ngôn ngữ:** TypeScript
*   **UI:** Material-UI (MUI)
*   **Quản lý State:** Zustand
*   **Fetch dữ liệu & Cache:** TanStack Query (React Query)
*   **Định tuyến:** React Router
*   **Thông báo:** React Toastify (sẽ được thay thế bởi "Trung tâm thông báo")

### 1.2. Cấu trúc thư mục chung

Dự án được tổ chức theo từng module chức năng, nằm trong `frontend/src/features/`.

```
frontend/src/
├── api/                 # Định nghĩa các lời gọi API
├── components/          # Các component UI dùng chung
├── features/            # **Các module chức năng chính**
│   ├── auth/            # Module đăng nhập
│   └── van-chuyen/      # Module vận chuyển
├── hooks/               # Các custom hook dùng chung
├── pages/               # Các trang chính (VD: LoginPage, HomePage)
├── providers/           # Các Context Provider (VD: AuthProvider)
├── stores/              # Các Zustand store
└── types/               # Các định nghĩa TypeScript
```

## 2. Các Module chức năng chính

### 2.1. Module Xác thực (`auth`)

*   **Mục đích:** Xử lý việc đăng nhập, đăng xuất và quản lý trạng thái xác thực của người dùng.
*   **Thành phần chính:**
    *   `pages/LoginPage.tsx`: Trang đăng nhập chính.
    *   `features/auth/components/LoginForm.tsx`: Component form chứa các trường username, password và nút đăng nhập.
    *   `hooks/useLogin.ts`: Custom hook sử dụng React Query (`useMutation`) để gọi API đăng nhập.
    *   `providers/AuthProvider.tsx`: Sử dụng React Context để cung cấp thông tin người dùng và trạng thái đăng nhập cho toàn bộ ứng dụng.

### 2.2. Module Vận chuyển (`van-chuyen`)

*   **Mục đích:** Xử lý nghiệp vụ tìm kiếm E1, bao gồm cả cơ chế polling chạy nền.
*   **Cấu trúc thư mục:**
    ```
    features/van-chuyen/
    ├── components/
    │   ├── SearchForm.tsx
    │   └── SearchResults.tsx
    ├── hooks/
    │   ├── useSearchE1.ts
    │   └── usePollE1Result.ts
    ├── pages/
    │   └── DeliveryPage.tsx
    ├── stores/
    │   └── backgroundJobsStore.ts
    └── types/
        └── index.ts
    ```

## 3. Logic xử lý & Trải nghiệm người dùng (UX)

### 3.1. Tìm kiếm ban đầu
*   Người dùng nhập thông tin và nhấn nút "Tìm kiếm" trên `DeliveryPage.tsx`.
*   Sử dụng `useMutation` của React Query để gọi API `/api/van-chuyen/search`.

### 3.2. Xử lý phản hồi từ API
*   **`onSuccess` callback của `useMutation`:**
    *   Nếu `response.status === 'SUCCESS'`: Hiển thị dữ liệu trong bảng như bình thường.
    *   Nếu `response.status === 'PENDING'`:
        1.  Hiển thị một thông báo toast (ví dụ: "Không tìm thấy dữ liệu, đang tiến hành đồng bộ từ hệ thống cũ...").
        2.  Gọi hàm `startJob` từ store Zustand `useBackgroundJobsStore`.

### 3.3. Hệ thống Polling và Thông báo trong nền (Zustand - `backgroundJobsStore.ts`)
*   `startJob(params)`:
    *   Tạo một `jobId` duy nhất từ các tham số tìm kiếm bằng `JSON.stringify`.
    *   Thêm một job mới vào state với `status: 'polling'`.
    *   Bắt đầu quá trình polling: gọi API `/api/van-chuyen/result/:job_id` mỗi 5 giây, trong tối đa 30 giây (6 lần thử).
*   **Khi Polling hoàn tất:**
    *   **Thành công:** Cập nhật job trong store thành `status: 'success'` và lưu dữ liệu trả về.
    *   **Thất bại:** Cập nhật job thành `status: 'failed'` và lưu thông báo lỗi.

### 3.4. Trung tâm thông báo (`NotificationBell.tsx`)
*   Component này nằm ở `Header.tsx`.
*   Lắng nghe sự thay đổi của các jobs trong `backgroundJobsStore`.
*   Khi có một job chuyển sang `status: 'success'` và chưa được đọc (`read: false`), một huy hiệu (badge) sẽ hiển thị trên biểu tượng chuông 🔔.
*   Khi người dùng nhấp vào chuông, một menu (dropdown) sẽ hiển thị danh sách các kết quả đã đồng bộ thành công.
*   Nhấp vào một kết quả trong danh sách sẽ kích hoạt `setJobToView(job)` và `markJobAsRead(job.id)`.

### 3.5. Hiển thị lại kết quả (`DeliveryPage.tsx`)
*   Một `useEffect` lắng nghe sự thay đổi của `jobToView` trong store.
*   Khi `jobToView` có giá trị, trang sẽ:
    1.  Tự động điền lại các ô input với thông tin từ `jobToView.params`.
    2.  Hiển thị dữ liệu từ `jobToView.data` vào bảng kết quả.
    3.  Reset `jobToView` về `null` bằng `clearViewedJob()` để tránh lặp lại.

## 4. Luồng dữ liệu và State

### 4.1. Tìm kiếm & Polling
*   `DeliveryPage` sử dụng `useSearchE1` để bắt đầu tìm kiếm. 
*   Nếu kết quả là `PENDING`, `backgroundJobsStore` sẽ được cập nhật, và `JobNotifier` (component toàn cục) sẽ dùng `usePollE1Result` để theo dõi job.

### 4.2. Xem lại kết quả
*   Khi một job hoàn thành, `JobNotifier` hiển thị thông báo. 
*   Nhấp vào thông báo sẽ cập nhật `jobToView` trong `backgroundJobsStore`, và `DeliveryPage` sẽ lắng nghe để hiển thị lại kết quả tương ứng.

## 5. Thành phần cốt lõi

### 5.1. `useSearchE1.ts`
*   Chứa logic quan trọng nhất để xử lý kết quả trả về từ backend (`SUCCESS`/`PENDING`) trong `onSuccess` callback.
*   **Đã khắc phục lỗi vòng lặp vô tận** bằng cách loại bỏ các `useEffect` gây xung đột và chuyển toàn bộ logic xử lý vào trong `onSuccess` callback của `useMutation`.

### 5.2. `backgroundJobsStore.ts`
*   "Bộ não" quản lý trạng thái của tất cả các job polling.
*   Logic polling và quản lý job được tách biệt hoàn toàn vào store Zustand.
*   Các components chỉ có nhiệm vụ "đọc" state từ store và "ra lệnh" cho store, giúp mã nguồn sạch sẽ và dễ bảo trì.

## 6. Các vấn đề đã khắc phục

### 6.1. Vòng lặp API vô tận (Đã khắc phục)
*   **Sự cố:** Đã xảy ra một lỗi nghiêm trọng khi `useEffect` và `useQuery` trong `DeliveryPage.tsx` xung đột, gây ra vòng lặp gọi API tìm kiếm liên tục.
*   **Tác động:** Tăng tải lên DB, nguy cơ "lụt" bảng trigger.
*   **Giải pháp:** Tái cấu trúc lại `DeliveryPage.tsx`, loại bỏ các `useEffect` gây xung đột và chuyển toàn bộ logic xử lý vào trong `onSuccess` callback của `useMutation`.

### 6.2. ID của Job đồng bộ
*   **Vấn đề:** ID ban đầu quá đơn giản, có thể bị trùng lặp.
*   **Giải pháp:** Tạo ID bằng cách `JSON.stringify` một object chứa các tham số tìm kiếm cốt lõi (`fromDate`, `toDate`, `mabcDong`, `mabcNhan`, `chthu`, `tuiso`...). Đảm bảo mỗi lần tìm kiếm với bộ tham số khác nhau sẽ là một job duy nhất.

### 6.3. Trải nghiệm người dùng với thông báo
*   **Vấn đề:** Hiển thị nhiều toast thông báo thành công gây rối và có thể bị người dùng bỏ lỡ.
*   **Giải pháp:** Chuyển từ toast thành công sang mô hình "Trung tâm thông báo" với biểu tượng chuông 🔔. Chỉ sử dụng toast cho các thông báo quan trọng cần chú ý ngay lập tức như lỗi đồng bộ.

## 7. Kế hoạch tương lai: Trung tâm thông báo 🔔

Để cải thiện UX và tránh làm phiền người dùng với quá nhiều thông báo toast, chúng ta đã thống nhất sẽ thay thế `React Toastify` bằng một "Trung tâm thông báo" (Notification Center) với các tính năng:

*   Biểu tượng chuông trên header với chỉ báo số lượng thông báo mới.
*   Click vào chuông sẽ mở ra một danh sách các job đã hoàn thành.
*   Người dùng có thể xem lại kết quả hoặc xóa thông báo từ danh sách này.
*   Tích hợp với `backgroundJobsStore` để quản lý trạng thái đọc/chưa đọc.

## 8. Các lưu ý quan trọng

*   **Bất đồng bộ:** Toàn bộ hệ thống được thiết kế để không chặn người dùng. Họ có thể bắt đầu một quá trình đồng bộ và tiếp tục làm việc khác, kết quả sẽ được thông báo sau.
*   **Quản lý State:** Logic polling và quản lý job được tách biệt hoàn toàn vào store Zustand. Các components chỉ có nhiệm vụ "đọc" state từ store và "ra lệnh" cho store, giúp mã nguồn sạch sẽ và dễ bảo trì.
*   **Performance:** Sử dụng React Query để cache dữ liệu và tối ưu hóa các cuộc gọi API.
*   **Type Safety:** Sử dụng TypeScript để đảm bảo type safety cho tất cả các props, state và API responses. 