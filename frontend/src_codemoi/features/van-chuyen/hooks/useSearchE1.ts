import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { SearchE1RequestDto, SearchE1ResponseDto } from '../types/vanChuyen.types';
import { formatDateToYyyymmdd } from '../../../utils/dateUtils';
import axiosInstance from '../../../api/axiosConfig';

type UseSearchE1Options = Omit<
  UseMutationOptions<SearchE1ResponseDto, Error, SearchE1RequestDto & { isPaging?: boolean; isPolling?: boolean }>,
  'mutationFn' | 'mutationKey'
>;

export const useSearchE1 = (options?: UseSearchE1Options) => {
  return useMutation({
    mutationKey: ['searchE1'],
    mutationFn: async (params: SearchE1RequestDto & { isPaging?: boolean; isPolling?: boolean }): Promise<SearchE1ResponseDto> => {
      const { isPaging, isPolling, ...searchParams } = params;
      const payload = {
        ...searchParams,
        fromDate: searchParams.fromDate ? formatDateToYyyymmdd(searchParams.fromDate) : null,
        toDate: searchParams.toDate ? formatDateToYyyymmdd(searchParams.toDate) : null,
        mabcDong: searchParams.mabcDong || '',
        mabcNhan: searchParams.mabcNhan || '',
        chthu: searchParams.chthu ? parseInt(searchParams.chthu, 10) : 0,
        tuiso: searchParams.tuiso ? parseInt(searchParams.tuiso, 10) : 0,
        khoiluong: searchParams.khoiluong ? parseFloat(searchParams.khoiluong) : undefined,
        isPolling: isPolling || false
      };

      const response = await axiosInstance.post<SearchE1ResponseDto>('/van-chuyen/e1/search', payload);
      return response.data;
    },
    ...options,
  });
};
