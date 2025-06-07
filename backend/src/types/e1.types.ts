export interface E1SearchRequest {
  fromDate: string;    // Format: YYYYMMDD
  toDate: string;      // Format: YYYYMMDD
  mabcDong?: string;
  mabcNhan?: string;
  chthu: number;
  tuiso: number;
  khoiluong?: number;
  page?: number;
  limit?: number;
}

export interface E1SearchResult {
  mae1: string;
  ngay: string;       // Format: DD/MM/YYYY
}

export interface E1SearchResponse {
  data: E1SearchResult[];
  totalCount: number;
  totalWeight: number;
  totalPages: number;
  currentPage: number;
}

export interface E1DetailInfo {
  stt: number;
  ngayCT: string;     // Format: DD/MM/YYYY
  gioDongCT: string;  // Format: DD/MM/YYYY HH:mm:ss
  buuCucDong: string;
  buuCucNhan: string;
  thongTinCT: string;
}

export interface E1BD10Info {
  stt: number;
  ngayBD10: string;       // Format: DD/MM/YYYY
  ngayXacNhanDi: string;  // Format: DD/MM/YYYY HH:mm:ss
  buuCucGiao: string;
  buuCucNhan: string;
  lanLapMaBD10: string;
}

export interface E1DetailResponse {
  e1Details: E1DetailInfo[];
  bd10Details: E1BD10Info[];
} 