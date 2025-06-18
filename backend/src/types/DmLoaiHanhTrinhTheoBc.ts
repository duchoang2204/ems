export interface DmLoaiHanhTrinhTheoBc {
    mabc_kt: number           // Mã bưu cục khai thác
    mabc: number              // Mã bưu cục nhận
    id_hanhtrinh: number      // ID hành trình (default = 0)
    diemnhan: string | null   // Điểm nhận (có thể null)
    diemtra: string | null    // Điểm trả (có thể null)
    uu_tien: number           // Ưu tiên (0 hoặc 1)
  }
  