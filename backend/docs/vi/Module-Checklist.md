# Checklist Tạo Module Mới

## 1. Chuẩn bị
- [ ] Xác định rõ business requirements
- [ ] Xác định các entities và relationships
- [ ] Xác định các use cases cần thiết
- [ ] Kiểm tra các stored procedures đã có sẵn

## 2. Tạo cấu trúc thư mục
- [ ] Tạo thư mục module mới trong `src/modules/[module-name]`
- [ ] Tạo các thư mục con theo cấu trúc DDD (xem DDD-Module-Template.md)
- [ ] Đảm bảo tuân thủ naming conventions

## 3. Domain Layer
- [ ] Tạo entities với đầy đủ properties
- [ ] Thêm domain logic vào entities nếu cần
- [ ] Định nghĩa repository interfaces
- [ ] Định nghĩa service interfaces
- [ ] Tạo các DTOs cần thiết

## 4. Data Access Layer
- [ ] Implement repository với Oracle
- [ ] Thêm decorator `@injectable()`
- [ ] Xử lý đầy đủ các trường hợp lỗi Oracle
- [ ] Thêm logging cho debug
- [ ] Đảm bảo đóng connection trong finally block

## 5. Service Layer
- [ ] Implement service interfaces
- [ ] Thêm decorator `@injectable()`
- [ ] Thêm `@inject()` cho dependencies
- [ ] Implement business logic
- [ ] Xử lý validation và error cases

## 6. Use Cases
- [ ] Tạo use case cho mỗi business operation
- [ ] Thêm decorator `@injectable()`
- [ ] Thêm `@inject()` cho service dependencies
- [ ] Implement execute method
- [ ] Xử lý error cases

## 7. Controllers & Routes
- [ ] Tạo controller với các endpoints cần thiết
- [ ] Tạo schema validation với Zod
- [ ] Thêm middleware validation
- [ ] Setup routes và register với container
- [ ] Thêm error handling

## 8. Dependency Injection
- [ ] Tạo tokens cho module trong `di/tokens.ts`
- [ ] Register repository trong container
- [ ] Register service trong container
- [ ] Register use cases trong container

## 9. Testing & Documentation
- [ ] Viết unit tests cho domain logic
- [ ] Viết integration tests cho repositories
- [ ] Viết API documentation
- [ ] Update README nếu cần

## 10. Security & Performance
- [ ] Review security considerations
- [ ] Thêm authorization nếu cần
- [ ] Optimize database queries
- [ ] Thêm caching nếu cần

## 11. Final Review
- [ ] Code review với team
- [ ] Kiểm tra coding standards
- [ ] Kiểm tra error handling
- [ ] Test trên staging environment
- [ ] Update documentation nếu có thay đổi

## Lưu ý quan trọng
1. Luôn bắt đầu từ domain layer và đi ra ngoài
2. Đảm bảo mỗi layer chỉ phụ thuộc vào layer bên trong
3. Không skip bất kỳ bước nào trong checklist
4. Review code kỹ trước khi deploy
5. Cập nhật documentation song song với development 