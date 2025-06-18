// Hook dùng React Query → call API Get E1 Details
// Chuyển đổi kiểu dữ liệu trước khi gửi API

import { useMutation } from '@tanstack/react-query';
import { 
  type GetE1DetailsRequestDto, 
  type GetE1DetailsResponseDto,
  DB_SOURCES,
  DB_POS_CODES,
  TABLE_CONFIGS,
  SPECIAL_POS_CODES
} from '../types/vanChuyen.types';
import { formatDateToYyyymmdd } from '../../../utils/dateUtils';
import axiosInstance from '../../../api/axiosConfig';

export const useE1Details = () => {
  return useMutation({
    mutationKey: ['getE1Details'],
    mutationFn: async (params: GetE1DetailsRequestDto): Promise<GetE1DetailsResponseDto> => {
      const payload = {
        ...params,
        fromDate: params.fromDate ? formatDateToYyyymmdd(params.fromDate) : null,
        toDate: params.toDate ? formatDateToYyyymmdd(params.toDate) : null,
        // Gửi thông tin về DB và mã bưu cục
        dbConfigs: Object.entries(DB_SOURCES).map(([key, value]) => ({
          dbName: value,
          posCode: DB_POS_CODES[value as keyof typeof DB_SOURCES]
        })),
        // Gửi cấu hình các bảng
        tableConfigs: Object.entries(TABLE_CONFIGS).map(([key, config]) => ({
          ...config,
          tableName: key
        })),
        // Mã bưu cục đặc biệt cần loại trừ
        specialPosCodes: SPECIAL_POS_CODES
      };

      const response = await axiosInstance.post<GetE1DetailsResponseDto>(
        '/van-chuyen/e1/details',
        payload
      );
      return response.data;
    }
  });
};
