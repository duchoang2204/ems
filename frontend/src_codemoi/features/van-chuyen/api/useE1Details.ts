// Hook dùng React Query → call API Get E1 Details
// Dùng formatDateToYyyymmdd từ utils → chuẩn hóa param ngày gửi backend

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { GetE1DetailsRequestDto, GetE1DetailsResponseDto } from '../types/vanChuyen.types';
import { formatDateToYyyymmdd } from '../../../utils/dateUtils';

export const useE1Details = () => {
  return useMutation({
    mutationFn: async (params: GetE1DetailsRequestDto): Promise<GetE1DetailsResponseDto> => {
      const payload = {
        ...params,
        fromDate: formatDateToYyyymmdd(params.fromDate),
        toDate: formatDateToYyyymmdd(params.toDate),
      };

      const response = await axios.post('/van-chuyen/e1/details', payload);
      return response.data as GetE1DetailsResponseDto;
    }
  });
};
