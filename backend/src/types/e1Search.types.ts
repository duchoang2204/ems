export interface E1SearchRequest {
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
    ngay: string;   // Định dạng DD/MM/YYYY
  }
  
  export interface E1SearchResponse {
    data: E1SearchResult[];
    totalCount: number;
    totalWeight: number;
    totalPages: number;
    currentPage: number;
  }
  