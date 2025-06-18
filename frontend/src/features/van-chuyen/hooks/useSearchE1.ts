import { useMutation } from '@tanstack/react-query';
import type { SearchE1RequestDto, SearchE1ResponseDto } from '../types/vanChuyen.types';
import { formatDateToYyyymmdd } from '../../../utils/dateUtils';
import axiosInstance from '../../../api/axiosConfig';

export const useSearchE1 = (key?: string) => {
  return useMutation({
    mutationKey: ['searchE1', key],
    mutationFn: async (params: SearchE1RequestDto & { isPaging?: boolean }): Promise<SearchE1ResponseDto> => {
      const { isPaging, ...searchParams } = params;
      const payload = {
        ...searchParams,
        fromDate: searchParams.fromDate ? formatDateToYyyymmdd(searchParams.fromDate) : null,
        toDate: searchParams.toDate ? formatDateToYyyymmdd(searchParams.toDate) : null,
        mabcDong: searchParams.mabcDong || '',
        mabcNhan: searchParams.mabcNhan || '',
        chthu: searchParams.chthu ? parseInt(searchParams.chthu) : 0,
        tuiso: searchParams.tuiso ? parseInt(searchParams.tuiso) : 0,
        khoiluong: searchParams.khoiluong ? parseFloat(searchParams.khoiluong) : undefined
      };

      const response = await axiosInstance.post<SearchE1ResponseDto>('/van-chuyen/e1/search', payload);
      return response.data;
    }
  });
};
