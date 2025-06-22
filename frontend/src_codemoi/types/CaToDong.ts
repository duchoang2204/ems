export interface CaToDong {
    ngay: number                  // YYYYMMDD
    ca: number                   // 1 = ca sáng, 2 = ca tối
    tenca: string                // tên ca
    ngaybatdau: number           // YYYYMMDD
    giobatdau: number            // hhmmss
    ngayketthuc: number          // YYYYMMDD
    gioketthuc: number           // hhmmss
    active: number               // 1 = đang hoạt động, 0 = kết thúc
    id_ca: number | null         // khóa định danh ca (nếu có)
    nvxacnhan_ca: string         // người xác nhận ca
    mabc_kt: number              // mã bưu cục khai thác
    auto_xnd: number             // 1 = xác nhận tự động
    date_log: Date               // ngày ghi log
  }
  