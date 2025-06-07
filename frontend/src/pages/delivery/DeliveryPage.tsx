import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Pagination,
  Container,
  Avatar,
  CardHeader,
  CircularProgress,
  Paper,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import type { E1SearchParams, E1SearchResult, E1DetailInfo, E1BD10Info } from '../../types';
import { E1Service } from '../../services/e1.service';
import { usePageTitle } from '../../hooks/usePageTitle';

const ITEMS_PER_PAGE = 10;

const formatDate = (date: Date | null): string => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const DeliveryPage: React.FC = () => {
  const { setPageTitle, resetPageTitle } = usePageTitle();
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [mabcDong, setMabcDong] = useState('');
  const [mabcNhan, setMabcNhan] = useState('');
  const [chthu, setChthu] = useState('');
  const [tuiso, setTuiso] = useState('');
  const [khoiluong, setKhoiluong] = useState('');
  const [data, setData] = useState<E1SearchResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedE1, setSelectedE1] = useState<string | null>(null);
  const [e1Details, setE1Details] = useState<E1DetailInfo[]>([]);
  const [bd10Details, setBD10Details] = useState<E1BD10Info[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    setPageTitle("Tra cứu thông tin bưu phẩm E1");
    const days = parseInt(localStorage.getItem("e1_search_days") || "7", 10);
    const today = new Date();
    const from = new Date(today);
    from.setDate(today.getDate() - days);

    setFromDate(from);
    setToDate(today);

    return () => {
      resetPageTitle();
    };
  }, [setPageTitle, resetPageTitle]);

  const handleSearch = async (page: number = 1) => {
    if (!chthu || !tuiso) {
      setError("Vui lòng nhập Chuyến thư và Túi số!");
      return;
    }

    setError(null);
    setIsLoading(true);
    setSelectedE1(null);

    try {
      const params: E1SearchParams = {
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
        mabcDong,
        mabcNhan,
        chthu: parseInt(chthu),
        tuiso: parseInt(tuiso),
        khoiluong: khoiluong ? parseInt(khoiluong) : undefined,
        page,
        limit: ITEMS_PER_PAGE
      };

      const result = await E1Service.search(params);
      setData(result.data);
      setTotalCount(result.totalCount);
      setTotalWeight(result.totalWeight);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (err) {
      const error = err as Error;
      console.error('Error searchE1:', error);
      setError(error.message);
      setNotification({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    handleSearch(page);
  };

  const handleE1Click = async (mae1: string) => {
    setSelectedE1(mae1);
    setIsLoading(true);

    try {
      const result = await E1Service.getDetails(mae1);
      setE1Details(result.e1Details);
      setBD10Details(result.bd10Details);
    } catch (err) {
      const error = err as Error;
      console.error('Error getting E1 details:', error);
      setNotification({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = async () => {
    if (!chthu || !tuiso) {
      setNotification({
        type: 'error',
        message: 'Vui lòng nhập Chuyến thư và Túi số trước khi xuất Excel!'
      });
      return;
    }

    setIsExporting(true);

    try {
      const params: E1SearchParams = {
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
        mabcDong,
        mabcNhan,
        chthu: parseInt(chthu),
        tuiso: parseInt(tuiso),
        khoiluong: khoiluong ? parseInt(khoiluong) : undefined
      };

      await E1Service.exportToExcel(params);
      setNotification({
        type: 'success',
        message: 'Xuất Excel thành công!'
      });
    } catch (err) {
      const error = err as Error;
      console.error('Error exporting to Excel:', error);
      setNotification({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth={false} sx={{ py: 2 }}>
        <Card sx={{ mb: 2 }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: 'primary.light' }}>
                <SearchIcon />
              </Avatar>
            }
            title={<Typography variant="subtitle1">Tìm kiếm</Typography>}
          />
          <CardContent sx={{ pt: 0, pb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3} component="div">
                <DatePicker
                  label="Từ ngày"
                  value={fromDate}
                  onChange={(newValue: Date | null) => setFromDate(newValue)}
                  slotProps={{ textField: { fullWidth: true, size: "small" } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} component="div">
                <DatePicker
                  label="Đến ngày"
                  value={toDate}
                  onChange={(newValue: Date | null) => setToDate(newValue)}
                  slotProps={{ textField: { fullWidth: true, size: "small" } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} component="div">
                <TextField 
                  fullWidth 
                  size="small"
                  label="Mã bưu cục đóng"
                  value={mabcDong}
                  onChange={(e) => setMabcDong(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} component="div">
                <TextField 
                  fullWidth 
                  size="small"
                  label="Mã bưu cục nhận"
                  value={mabcNhan}
                  onChange={(e) => setMabcNhan(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} component="div">
                <TextField 
                  fullWidth 
                  size="small"
                  label="Chuyến thư"
                  value={chthu}
                  onChange={(e) => setChthu(e.target.value)}
                  error={!!error && !chthu}
                  helperText={error && !chthu ? 'Vui lòng nhập Chuyến thư' : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} component="div">
                <TextField 
                  fullWidth 
                  size="small"
                  label="Túi số"
                  value={tuiso}
                  onChange={(e) => setTuiso(e.target.value)}
                  error={!!error && !tuiso}
                  helperText={error && !tuiso ? 'Vui lòng nhập Túi số' : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} component="div">
                <TextField 
                  fullWidth 
                  size="small"
                  label="Khối lượng"
                  value={khoiluong}
                  onChange={(e) => setKhoiluong(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} component="div">
                <Button 
                  variant="contained" 
                  onClick={() => handleSearch(1)} 
                  sx={{ mr: 2 }}
                  startIcon={<SearchIcon />}
                  disabled={isLoading}
                  size="small"
                >
                  {isLoading ? <CircularProgress size={20} /> : 'Tìm kiếm'}
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={handleExportExcel}
                  startIcon={<FileDownloadIcon />}
                  disabled={isLoading || isExporting || data.length === 0}
                  size="small"
                >
                  {isExporting ? <CircularProgress size={20} /> : 'Xuất Excel'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          {/* Search Results Card */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardHeader
                title={<Typography variant="subtitle1">Kết quả tìm kiếm</Typography>}
              />
              <CardContent>
                {error && (
                  <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}
                
                {!error && (
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Tổng số E1: {totalCount} — Tổng KL: {totalWeight}g
                  </Typography>
                )}

                {isLoading ? (
                  <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell 
                            sx={{ 
                              borderRight: '1px solid rgba(224, 224, 224, 1)',
                              width: '140px',
                              padding: '6px 4px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Mã E1
                          </TableCell>
                          <TableCell
                            sx={{ 
                              width: '80px',
                              padding: '6px 4px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Ngày
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((row) => (
                          <TableRow key={row.mae1}>
                            <TableCell
                              sx={{ 
                                borderRight: '1px solid rgba(224, 224, 224, 1)',
                                padding: '6px 4px',
                                cursor: 'pointer',
                                color: 'primary.main',
                                '&:hover': {
                                  textDecoration: 'underline',
                                  backgroundColor: 'action.hover'
                                }
                              }}
                              onClick={() => handleE1Click(row.mae1)}
                            >
                              {row.mae1}
                            </TableCell>
                            <TableCell
                              sx={{ 
                                padding: '6px 4px'
                              }}
                            >
                              {row.ngay}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {data.length > 0 && (
                      <Box mt={2} display="flex" justifyContent="center">
                        <Pagination 
                          count={totalPages} 
                          page={currentPage}
                          onChange={handlePageChange}
                          color="primary"
                          size="small"
                        />
                      </Box>
                    )}

                    {data.length === 0 && !isLoading && (
                      <Typography textAlign="center" sx={{ my: 4 }}>
                        Không tìm thấy kết quả nào
                      </Typography>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* E1 Details Card */}
          <Grid item xs={12} md={9}>
            <Card>
              <CardHeader
                title={
                  <Typography variant="subtitle1">
                    {selectedE1 ? `Chi tiết E1: ${selectedE1}` : 'Chi tiết E1'}
                  </Typography>
                }
              />
              <CardContent>
                {!selectedE1 ? (
                  <Typography textAlign="center" sx={{ my: 4 }}>
                    Chọn một mã E1 từ kết quả tìm kiếm để xem chi tiết
                  </Typography>
                ) : (
                  <>
                    <Paper elevation={0} variant="outlined" sx={{ mb: 3, p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Thông tin chuyến thư
                      </Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Ngày CT</TableCell>
                            <TableCell>Giờ đóng CT</TableCell>
                            <TableCell>Bưu cục đóng</TableCell>
                            <TableCell>Bưu cục nhận</TableCell>
                            <TableCell>Thông tin CT</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {e1Details.map((detail) => (
                            <TableRow key={detail.stt}>
                              <TableCell>{detail.stt}</TableCell>
                              <TableCell>{detail.ngayCT}</TableCell>
                              <TableCell>{detail.gioDongCT}</TableCell>
                              <TableCell>{detail.buuCucDong}</TableCell>
                              <TableCell>{detail.buuCucNhan}</TableCell>
                              <TableCell>{detail.thongTinCT}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Paper>

                    <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Thông tin giao nhận BD10
                      </Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Ngày BD10</TableCell>
                            <TableCell>Ngày xác nhận đi</TableCell>
                            <TableCell>Bưu cục giao</TableCell>
                            <TableCell>Bưu cục nhận</TableCell>
                            <TableCell>Lần lập/Mã BD10</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {bd10Details.map((detail) => (
                            <TableRow key={detail.stt}>
                              <TableCell>{detail.stt}</TableCell>
                              <TableCell>{detail.ngayBD10}</TableCell>
                              <TableCell>{detail.ngayXacNhanDi}</TableCell>
                              <TableCell>{detail.buuCucGiao}</TableCell>
                              <TableCell>{detail.buuCucNhan}</TableCell>
                              <TableCell>{detail.lanLapMaBD10}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Paper>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Snackbar
          open={!!notification}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification?.type || 'info'}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification?.message || ''}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default DeliveryPage; 