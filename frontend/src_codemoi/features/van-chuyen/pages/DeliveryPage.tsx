// Page chính DeliveryPage → compose các component SearchForm, SearchResults, E1Details

import React, { useState, useCallback, useMemo } from 'react';
import { Container, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import SearchForm from '../components/SearchForm';
import SearchResults from '../components/SearchResults';
import E1Details from '../components/E1Details';
import { useSearchE1 } from '../hooks/useSearchE1';
import { useE1Details } from '../hooks/useE1Details';
import { useDefaultDates } from '../../../hooks/useDefaultDates';
import { useBackgroundJobsStore } from '../../../stores/backgroundJobsStore';
import { speak } from '../../../utils/tts';
import type { SearchE1RequestDto, GetE1DetailsRequestDto, SearchE1ResponseDto, E1Info } from '../types/vanChuyen.types';

const DeliveryPage: React.FC = () => {
  const defaultDates = useDefaultDates();

  const [searchParams, setSearchParams] = useState<SearchE1RequestDto>({
    fromDate: defaultDates.fromDate,
    toDate: defaultDates.toDate,
    mabcDong: '',
    mabcNhan: '',
    chthu: '',
    tuiso: '',
    khoiluong: '',
    page: 1,
    limit: 10,
  });
  
  const [displayData, setDisplayData] = useState<SearchE1ResponseDto | undefined>();
  const [selectedE1, setSelectedE1] = useState<string | null>(null);
  const [isPaging, setIsPaging] = useState(false);
  
  const startJob = useBackgroundJobsStore((state) => state.startJob);
  const jobToView = useBackgroundJobsStore((state) => state.jobToView);
  const clearViewedJob = useBackgroundJobsStore((state) => state.clearViewedJob);

  const searchE1Mutation = useSearchE1({
    onSuccess: (response, variables) => {
      // eslint-disable-next-line no-console
      console.log('[DeliveryPage] Search API Response:', response);
      // Bỏ qua nếu đây là response của việc polling từ job cũ
      if (variables.isPolling) return;

      if (response.status === 'SUCCESS') {
        setDisplayData(response);
        // Tạo và đọc thông báo động
        const message = `Kết quả tìm kiếm là ${response.totalCount} mã e1 và tổng khối lượng là ${response.totalWeight}.`;
        speak(message);
      } else if (response.status === 'PENDING') {
        toast.info('Đang đồng bộ dữ liệu từ hệ thống cũ. Bạn có thể tiếp tục tìm kiếm khác...', {
          autoClose: 3000,
        });
        startJob(variables);
        setDisplayData(undefined); // Xóa kết quả cũ để người dùng biết đang có tác vụ mới
      } else if (response.status === 'FAILED') {
        toast.error(response.message || 'Có lỗi xảy ra khi tìm kiếm dữ liệu');
        setDisplayData(undefined);
      }
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error('[DeliveryPage] Search API Error:', error);
      toast.error(`Lỗi hệ thống: ${error.message}`);
      setDisplayData(undefined);
    },
  });

  const exportExcelMutation = useSearchE1({});
  const e1DetailsMutation = useE1Details();

  const formParams = useMemo(() => {
    const { fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong } = searchParams;
    return { fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong };
  }, [searchParams]);

  const handleChangeField = useCallback((field: string, value: string | number | Date | null) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
      page: 1, 
    }));
  }, []);

  const handleSearch = useCallback(() => {
    // "Unlock" the Audio API by playing a silent sound on user interaction
    speak('');
    clearViewedJob();
    setIsPaging(false);
    setSelectedE1(null);
    searchE1Mutation.mutate({ ...searchParams, isPaging: false, isPolling: false });
  }, [searchParams, searchE1Mutation, clearViewedJob]);

  const handlePageChange = useCallback((page: number) => {
    setIsPaging(true);
    const newParams = { ...searchParams, page, isPaging: true, isPolling: false };
    setSearchParams(newParams);
    searchE1Mutation.mutate(newParams);
  }, [searchParams, searchE1Mutation]);

  const handleExportExcel = useCallback(async () => {
    const result = await exportExcelMutation.mutateAsync({
      ...searchParams,
      isPaging: false,
      page: 1,
      limit: displayData?.totalCount || 1000,
    });
    return result;
  }, [searchParams, displayData, exportExcelMutation]);

  const handleViewDetails = useCallback((e1Info: E1Info) => {
    setSelectedE1(e1Info.mae1);
        
    const params: GetE1DetailsRequestDto = {
      mae1: e1Info.mae1,
      fromDate: searchParams.fromDate,
      toDate: searchParams.toDate,
    };
    e1DetailsMutation.mutate(params);
  }, [e1DetailsMutation, searchParams.fromDate, searchParams.toDate]);

  React.useEffect(() => {
    if (jobToView) {
      // Luôn điền lại form với params của job được chọn
      setSearchParams(jobToView.params);
      // Hiển thị data nếu có, hoặc reset nếu không có
      setDisplayData(jobToView.data); 
      setSelectedE1(null);
      setIsPaging(false);
      
      // Hiển thị thông báo phù hợp với trạng thái của job
      if (jobToView.status === 'success' && jobToView.data) {
        toast.success("Đã tải lại kết quả của lần đồng bộ trước.");
        // Phát lại âm thanh kết quả
        const message = `Kết quả tìm kiếm là ${jobToView.data.totalCount} mã e1 và tổng khối lượng là ${jobToView.data.totalWeight}.`;
        speak(message);
      } else if (jobToView.status === 'success_empty') {
        toast.info("Lần đồng bộ trước hoàn tất nhưng không tìm thấy dữ liệu.");
        speak("Không tìm thấy dữ liệu cho lần đồng bộ trước.");
      }
    }
  }, [jobToView]);

  const isSearching = searchE1Mutation.isPending && !isPaging;

  return (
    <Container maxWidth={false} sx={{ py: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchForm
            {...formParams}
            onChangeField={handleChangeField}
            onSearch={handleSearch}
            isLoading={isSearching}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={3}>
          <SearchResults
            searchResult={displayData}
            isLoading={isSearching}
            onSelectE1={handleViewDetails}
            onPageChange={handlePageChange}
            onExportExcel={handleExportExcel}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={8} lg={9}>
          <E1Details
            selectedE1={selectedE1}
            e1Details={e1DetailsMutation.data?.e1Details || []}
            bd10Details={e1DetailsMutation.data?.bd10Details || []}
            isLoading={e1DetailsMutation.isPending}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DeliveryPage;
