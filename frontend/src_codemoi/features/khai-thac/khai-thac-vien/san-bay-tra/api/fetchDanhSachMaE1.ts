// src/features/khai-thac/khai-thac-vien/san-bay-tra/api/fetchDanhSachMaE1.ts

import axios from '@/lib/axiosInstance';
import { MaE1 } from '../types/MaE1.types';

export const fetchDanhSachMaE1 = async (params: {
  mabc_kt: number;
  mabc: number;
  chthu: number;
  tuiso: number;
  ngay: number;
}): Promise<MaE1[]> => {
  const response = await axios.get('/khai-thac/khai-thac-vien/san-bay-tra/ma-e1', {
    params,
  });
  return response.data;
};
