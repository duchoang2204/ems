export interface CaToMo {
    ngay: number                 // YYYYMMDD
    ca: number                  // 1 = ca sáng, 2 = ca tối
    tenca: string               // tên ca
    ngaybatdau: number          // YYYYMMDD
    giobatdau: number           // hhmmss
    ngayketthuc: number         // YYYYMMDD
    gioketthuc: number          // hhmmss
    active: number              // 1 = đang mở, 0 = đã kết thúc
    id_ca: number | null        // id định danh ca (nếu có)
    nvxacnhan_ca: string        // người xác nhận mở ca
    mabc_kt: number             // mã bưu cục khai thác
  }
  