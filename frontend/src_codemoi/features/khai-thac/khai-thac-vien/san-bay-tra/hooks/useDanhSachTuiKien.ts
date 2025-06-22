// src/features/khai-thac/khai-thac-vien/san-bay-tra/hooks/useDanhSachTuiKien.ts

import { useQuery } from '@tanstack/react-query';
import { fetchDanhSachTuiKien } from '../api/fetchDanhSachTuiKien';
import { format } from 'date-fns';

export const useDanhSachTuiKien = (fromDate: Date, toDate: Date) => {
  return useQuery({
    queryKey: ['danh-sach-tui-kien', fromDate, toDate],
    queryFn: () =>
      fetchDanhSachTuiKien({
        fromDate: format(fromDate, 'yyyyMMdd'),
        toDate: format(toDate, 'yyyyMMdd'),
      }),
    keepPreviousData: true,
    staleTime: 0,
  });
};
