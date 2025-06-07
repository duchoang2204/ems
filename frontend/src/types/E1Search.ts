export interface E1SearchParams {
  fromDate: string;   // YYYYMMDD
  toDate: string;     // YYYYMMDD
  mabcDong?: string;
  mabcNhan?: string;
  chthu: number;
  tuiso: number;
  khoiluong?: number;
}

export interface E1SearchResult {
  mae1: string;
  ngay: string;   // Định dạng DD/MM/YYYY
}

export interface E1SearchResponse {
  totalCount: number;
  totalWeight: number;
  data: E1SearchResult[];
}
