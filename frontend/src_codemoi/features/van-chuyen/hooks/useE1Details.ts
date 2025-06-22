// Hook dùng React Query → call API Get E1 Details
// Chuyển đổi kiểu dữ liệu trước khi gửi API

import { useMutation } from '@tanstack/react-query';
import { 
  type GetE1DetailsRequestDto, 
  type GetE1DetailsResponseDto
} from '../types/vanChuyen.types';
import axiosInstance from '../../../api/axiosConfig';

export const useE1Details = () => {
  return useMutation({
    mutationKey: ['getE1Details'],
    mutationFn: async (params: GetE1DetailsRequestDto): Promise<GetE1DetailsResponseDto> => {
      // Bây giờ chỉ cần gửi thẳng params, không cần xử lý gì thêm
      const response = await axiosInstance.post<GetE1DetailsResponseDto>(
        '/van-chuyen/e1/details',
        params 
      );
      return response.data;
    }
  });
};
