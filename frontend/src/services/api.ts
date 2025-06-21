import axios from 'axios';
import type { SearchE1RequestDto, SearchE1ResponseDto } from '../features/van-chuyen/types/vanChuyen.types';
import { format } from 'date-fns';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Gọi API để tìm kiếm E1
 * @param params Các tham số tìm kiếm
 * @returns Promise chứa kết quả tìm kiếm
 */
export const searchE1Api = async (params: SearchE1RequestDto): Promise<SearchE1ResponseDto> => {
  // Chuyển đổi Date object sang string YYYYMMDD trước khi gửi
  const apiParams = {
    ...params,
    fromDate: params.fromDate ? format(params.fromDate, 'yyyyMMdd') : undefined,
    toDate: params.toDate ? format(params.toDate, 'yyyyMMdd') : undefined,
  };

  const { data } = await api.post<SearchE1ResponseDto>('/van-chuyen/e1/search', apiParams);
  return data;
}; 