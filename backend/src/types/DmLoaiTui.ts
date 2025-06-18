export interface DmLoaiTui {
    id_loai_tui: number         // ID loại túi
    ma_loai_tui: string         // Mã loại túi (ví dụ: TH, PH...)
    ten_loai_tui: string        // Tên loại túi (diễn giải)
    sap_xep: number             // Giá trị sắp xếp
    id_loai_chthu: number       // ID loại chuyến thư tương ứng
    su_dung: number             // 1 = đang sử dụng, 0 = không sử dụng
  }
  