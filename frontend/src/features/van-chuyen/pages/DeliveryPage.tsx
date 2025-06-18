// Page chính DeliveryPage → compose các component SearchForm, SearchResults, E1Details

import React, { useState, useCallback, useMemo } from 'react';
import { Container, Grid } from '@mui/material';
import SearchForm from '../components/SearchForm';
import SearchResults from '../components/SearchResults';
import E1Details from '../components/E1Details';
import { useSearchE1 } from '../hooks/useSearchE1';
import { useE1Details } from '../hooks/useE1Details';
import { useDefaultDates } from '../../../hooks/useDefaultDates';
import type { SearchE1RequestDto, GetE1DetailsRequestDto } from '../types/vanChuyen.types';

const DeliveryPage: React.FC = () => {
  const defaultDates = useDefaultDates();

  // State lưu params search form
  const [searchParams, setSearchParams] = useState<SearchE1RequestDto>({
    fromDate: defaultDates.fromDate,
    toDate: defaultDates.toDate,
    mabcDong: '',
    mabcNhan: '',
    chthu: '',
    tuiso: '',
    khoiluong: '',
    page: 1,
    limit: 10
  });

  const [selectedE1, setSelectedE1] = useState<string | null>(null);
  const [isPaging, setIsPaging] = useState(false);

  const searchE1Mutation = useSearchE1('search');
  const exportExcelMutation = useSearchE1('export');
  const e1DetailsMutation = useE1Details();

  // Tách form params ra khỏi searchParams để tránh re-render không cần thiết
  const formParams = useMemo(() => {
    const { fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong } = searchParams;
    return { fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong };
  }, [searchParams.fromDate, searchParams.toDate, searchParams.mabcDong, 
      searchParams.mabcNhan, searchParams.chthu, searchParams.tuiso, searchParams.khoiluong]);

  // Memoize các callback để tránh re-render không cần thiết
  const handleChangeField = useCallback((field: string, value: string | number | Date | null) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
      // Reset page về 1 khi thay đổi các field search
      ...(field !== 'page' ? { page: 1 } : {})
    }));
  }, []);

  const handleSearch = useCallback(() => {
    setIsPaging(false);
    searchE1Mutation.mutate({ ...searchParams, isPaging: false });
    setSelectedE1(null); // reset details khi search mới
  }, [searchParams, searchE1Mutation]);

  const handlePageChange = useCallback((page: number) => {
    setIsPaging(true);
    setSearchParams((prev) => ({
      ...prev,
      page
    }));
    searchE1Mutation.mutate({
      ...searchParams,
      page,
      isPaging: true
    });
  }, [searchParams, searchE1Mutation]);

  const handleExportExcel = useCallback(async () => {
    // Gọi API riêng để lấy toàn bộ dữ liệu cho Excel
    const result = await exportExcelMutation.mutateAsync({
      ...searchParams,
      isPaging: false,
      page: 1,
      limit: searchE1Mutation.data?.totalCount || 1000
    });
    return result;
  }, [searchParams, searchE1Mutation.data?.totalCount, exportExcelMutation]);

  const handleViewDetails = useCallback((mae1: string) => {
    setSelectedE1(mae1);
    const params: GetE1DetailsRequestDto = {
      mae1,
      fromDate: searchParams.fromDate,
      toDate: searchParams.toDate,
      mabcDong: searchParams.mabcDong,
      mabcNhan: searchParams.mabcNhan,
      chthu: searchParams.chthu,
      tuiso: searchParams.tuiso
    };
    e1DetailsMutation.mutate(params);
  }, [searchParams, e1DetailsMutation]);

  // Chỉ hiển thị loading khi thực hiện tìm kiếm mới, không hiển thị khi phân trang
  const isSearching = searchE1Mutation.isPending && !isPaging;

  // Auto search khi component mount
  React.useEffect(() => {
    handleSearch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

        <Grid item xs={12} md={3}>
          <SearchResults
            searchResult={searchE1Mutation.data}
            isLoading={searchE1Mutation.isPending}
            onSelectE1={handleViewDetails}
            onPageChange={handlePageChange}
            onExportExcel={handleExportExcel}
          />
        </Grid>

        <Grid item xs={12} md={9}>
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
