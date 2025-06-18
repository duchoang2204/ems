// src/features/khai-thac/khai-thac-vien/san-bay-tra/types/SanBayTra.types.ts

// src/features/khai-thac/khai-thac-vien/san-bay-tra/types/SanBayTra.types.ts
import type { TuiKien } from './TuiKien.types';

export interface XacNhanDenPayload {
  lanlap: number;
  ngaykt: number;
  cakt: number;
  manv: number;
  listTuiKien: Array<Omit<TuiKien, 'ischon'> & { ischon: number }>;
}
