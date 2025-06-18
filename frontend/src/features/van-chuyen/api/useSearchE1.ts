// Hook dùng React Query → call API search E1
// Dùng formatDateToYyyymmdd từ utils → chuẩn hóa param ngày gửi backend

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { SearchE1RequestDto, SearchE1ResponseDto } from '../types/vanChuyen.types';
import { formatDateToYyyymmdd } from '../../../utils/dateUtils';

export const useSearchE1 = () => {
  return useMutation({
    mutationFn: async (params: SearchE1RequestDto): Promise<SearchE1ResponseDto> => {
      const payload = {
        ...params,
        fromDate: formatDateToYyyymmdd(params.fromDate),
        toDate: formatDateToYyyymmdd(params.toDate),
      };

      const response = await axios.post('/van-chuyen/e1/search', payload);
      return response.data as SearchE1ResponseDto;
    }
  });
};
