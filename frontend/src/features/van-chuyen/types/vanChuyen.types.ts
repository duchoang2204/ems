// DTO SearchE1
export interface SearchE1RequestDto {
  fromDate: Date | null;    // UI: DatePicker → API: string YYYYMMDD
  toDate: Date | null;      // UI: DatePicker → API: string YYYYMMDD
  mabcDong: string;         // UI: string → DB: mabc_kt (number)
  mabcNhan: string;         // UI: string → DB: mabc (number)
  chthu: string;           // UI: string → DB: number
  tuiso: string;           // UI: string → DB: number
  khoiluong: string;
  page: number;
  limit: number;
  isPaging?: boolean;
  isPolling?: boolean;
}

export interface E1Info {
  mae1: string;
  ngay: string;
  mabcDong: string;
  mabcNhan: string;
  chthu: string;
  tuiso: string;
  khoiluong: string;
}

export interface SearchE1ResponseDto {
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  message?: string;
  data?: E1Info[];
  totalCount?: number;
  totalWeight?: number;
  currentPage?: number;
  totalPages?: number;
}

// DTO GetE1Details
export interface GetE1DetailsRequestDto {
  mae1: string;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface GetE1DetailsResponseDto {
  e1Details: E1DetailInfo[];
  bd10Details: E1BD10Info[];
}

// SQL Server Entities - giữ nguyên interface
export interface E1DetailInfo {
  stt: number;
  eventTimestamp: string; // ISO 8601 date string from backend
  loai: string;
  buuCucDong: string;
  buuCucNhan: string;
  thongTinCT: string;
}

export interface E1BD10Info {
  stt: number;
  ngayBD10: string;
  ngayXacNhanDi: string;
  buuCucGiao: string;
  buuCucNhan: string;
  lanLapMaBD10: string;
}

// Constants cho mã bưu cục đặc biệt cần loại trừ
export const SPECIAL_POS_CODES = ['101998', '100998'];

// Định nghĩa các DB cần truy vấn
export const DB_SOURCES = {
  HNLT: 'HNLT',   // 100916
  HNNT: 'HNNT',   // 101000
  HCMLT: 'HCMLT'  // 700916
} as const;

// Mã bưu cục tương ứng với từng DB
export const DB_POS_CODES = {
  [DB_SOURCES.HNLT]: '100916',
  [DB_SOURCES.HNNT]: '101000',
  [DB_SOURCES.HCMLT]: '700916'
} as const;

// Định nghĩa các bảng và logic nghiệp vụ
export const TABLE_CONFIGS = {
  // Bảng dữ liệu đến liên tỉnh (100916, 700916)
  E1E2: {
    name: 'e1e2',
    type: 'LIEN_TINH',
    direction: 'DEN',
    isSpecial: false,
    validMabc: ['100916', '700916']  // Mã bưu cục nhận phải là HNLT hoặc HCMLT
  },
  // Bảng xác nhận đến liên tỉnh
  E1E2_DS: {
    name: 'e1e2_ds',
    type: 'LIEN_TINH',
    direction: 'DEN',
    isSpecial: true,
    validMabc: ['100916', '700916']
  },
  // Bảng dữ liệu đến nội tỉnh (101000)
  E1E1: {
    name: 'e1e1',
    type: 'NOI_TINH',
    direction: 'DEN',
    isSpecial: false,
    validMabc: ['101000']  // Mã bưu cục nhận phải là HNNT
  },
  // Bảng xác nhận đến nội tỉnh
  E1E1_DS: {
    name: 'e1e1_ds',
    type: 'NOI_TINH',
    direction: 'DEN',
    isSpecial: true,
    validMabc: ['101000']
  },
  // Bảng dữ liệu đi liên tỉnh
  E1I2: {
    name: 'e1i2',
    type: 'LIEN_TINH',
    direction: 'DI',
    isSpecial: false,
    validMabcKt: ['100916', '700916']  // Mã bưu cục đóng phải là HNLT hoặc HCMLT
  },
  // Bảng dữ liệu đi nội tỉnh
  E1I1: {
    name: 'e1i1',
    type: 'NOI_TINH',
    direction: 'DI',
    isSpecial: false,
    validMabcKt: ['101000']  // Mã bưu cục đóng phải là HNNT
  }
} as const;

// Interface cho response từ các bảng
export interface E1DetailBase {
  stt: number;
  ngay: string;
  gio: string;
  mabc_kt: string;  // Mã bưu cục đóng
  mabc: string;     // Mã bưu cục nhận
  chthu: string;
  tuiso: string;
  date_log?: string; // Chỉ có ở bảng _ds
  tableName: keyof typeof TABLE_CONFIGS;
}

// Thông tin đã được format để hiển thị
export interface E1DetailInfo {
  stt: number;
  eventTimestamp: string; // ISO 8601 date string from backend
  loai: string;
  buuCucDong: string;
  buuCucNhan: string;
  thongTinCT: string;
  isSpecialTable: boolean;
  tableType: 'LIEN_TINH' | 'NOI_TINH';
  direction: 'DEN' | 'DI';
}
