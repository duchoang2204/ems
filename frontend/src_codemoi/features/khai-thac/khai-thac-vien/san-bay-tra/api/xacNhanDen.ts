// src/features/khai-thac/khai-thac-vien/san-bay-tra/api/xacNhanDen.ts

import axios from '@/lib/axiosInstance';

export const xacNhanDen = async (data: {
  lanlap: number;
  ngaykt: number;
  cakt: number;
  manv: number;
  listTuiKien: Array<{
    mabc_kt: number;
    mabc: number;
    ngay: number;
    chthu: number;
    tuiso: number;
    id_e2: string;
    ischon: number;
  }>;
}): Promise<void> => {
  await axios.post('/khai-thac/khai-thac-vien/san-bay-tra/xac-nhan-den', data);
};
