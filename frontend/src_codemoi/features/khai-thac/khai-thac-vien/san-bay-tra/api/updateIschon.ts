// src/features/khai-thac/khai-thac-vien/san-bay-tra/api/updateIschon.ts

import axios from '@/lib/axiosInstance';

export const updateIschon = async (data: {
  ngay: number;
  mabc_kt: number;
  mabc: number;
  chthu: number;
  tuiso: number;
  id_e2: string;
  ischon: number;
}) => {
  await axios.post('/khai-thac/khai-thac-vien/san-bay-tra/update-ischon', data);
};
