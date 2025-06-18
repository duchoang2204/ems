// src/features/khai-thac/khai-thac-vien/san-bay-tra/hooks/useDanhSachMaE1.ts

import { useQuery } from '@tanstack/react-query';
import { fetchDanhSachMaE1 } from '../api/fetchDanhSachMaE1';
import { TuiKien } from '../types/TuiKien.types';

export const useDanhSachMaE1 = (tui: TuiKien | null) => {
  return useQuery({
    queryKey: ['danh-sach-ma-e1', tui?.mabc_kt, tui?.mabc, tui?.chthu, tui?.tuiso],
    queryFn: () =>
      tui
        ? fetchDanhSachMaE1({
            mabc_kt: tui.mabc_kt,
            mabc: tui.mabc,
            chthu: tui.chthu,
            tuiso: tui.tuiso,
            ngay: tui.ngay,
          })
        : Promise.resolve([]),
    enabled: !!tui,
    staleTime: 0,
  });
};
