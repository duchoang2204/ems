export interface E1Data {
  mae1: string;
  mabctra: number;
  mabcnhan: number;
  chthu: number;
  tuiso: number;
  khoiluong: number;
  ngay: number;
  gio: number;
}

export interface E1SearchParams {
  fromDate: string;
  toDate: string;
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
  ngay: number;
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
  ngayCT: string;
  gioDongCT: string;
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

export interface E1DetailResponse {
  e1Details: E1DetailInfo[];
  bd10Details: E1BD10Info[];
} 