// src/features/khai-thac/khai-thac-vien/san-bay-tra/api/fetchDanhSachTuiKien.ts

import axios from '@/lib/axiosInstance';
import { TuiKien } from '../types/TuiKien.types';

export const fetchDanhSachTuiKien = async (params: {
  fromDate: string;
  toDate: string;
}): Promise<TuiKien[]> => {
  const response = await axios.get('/khai-thac/khai-thac-vien/san-bay-tra/danh-sach-tui-kien', {
    params,
  });
  return response.data;
};
