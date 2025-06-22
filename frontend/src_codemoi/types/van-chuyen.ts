export interface SearchE1RequestDto {
  fromDate?: string;
  toDate?: string;
  mabcDong?: string;
  mabcNhan?: string;
  chthu: string;
  tuiso: string;
  khoiluong?: string;
  page?: number;
  limit?: number;
  isPolling?: boolean;
}

export interface E1Info {
    mae1: string;
    ngay: string;
    khoiluong: number;
    mabcDong: string;
    mabcNhan: string;
    chthu: string;
    tuiso: string;
}

export interface SearchE1Response {
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    data?: E1Info[];
    totalCount?: number;
    totalWeight?: number;
    currentPage?: number;
    totalPages?: number;
    message?: string;
} 