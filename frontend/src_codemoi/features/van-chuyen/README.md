# Feature: Van Chuyen (Tra cứu E1)

## Luồng nghiệp vụ

1️⃣ Người dùng nhập form tìm kiếm:
- Từ ngày, Đến ngày
- Mã bưu cục đóng, nhận
- Chuyến thư, Túi số
- Khối lượng (tuỳ chọn)

2️⃣ API `/van-chuyen/e1/search` trả về:
- List mã E1
- Tổng số E1
- Tổng khối lượng
- Phân trang

3️⃣ Người dùng click vào mã E1 → gọi `/van-chuyen/e1/details` trả về:
- Chi tiết chuyến thư E1
- Thông tin giao nhận BD10

## Cấu trúc folder

```txt
features/van-chuyen/
├── api/ → Hooks call API (React Query)
├── components/ → SearchForm, SearchResults, E1Details
├── hooks/ → Wrapper hook cho API call
├── pages/ → DeliveryPage (compose các component)
├── types/ → Types chuẩn giữa FE-BE
