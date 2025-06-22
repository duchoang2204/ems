// Component hiển thị kết quả tìm kiếm E1
// props: list E1, tổng E1, tổng khối lượng, phân trang, onClick E1

import React, { useState } from 'react';
import {
  Card, CardHeader, CardContent, Table, TableHead, TableRow, TableCell, TableBody,
  Typography, Pagination, Box, TextField, IconButton, Tooltip, Divider, Button,
  TableContainer, Paper
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';
import type { SearchE1ResponseDto, E1Info } from '../types/vanChuyen.types';

interface Props {
  searchResult: SearchE1ResponseDto | undefined;
  isLoading: boolean;
  onSelectE1: (e1Info: E1Info) => void;
  onPageChange: (page: number) => void;
  onExportExcel: () => Promise<SearchE1ResponseDto>;
}

const SearchResults: React.FC<Props> = (props) => {
  const { searchResult, isLoading, onSelectE1, onPageChange, onExportExcel } = props;
  const [pageInput, setPageInput] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handlePageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Chỉ cho phép nhập số
    if (/^\d*$/.test(value)) {
      setPageInput(value);
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(pageInput);
    if (page && searchResult && searchResult.totalPages && page >= 1 && page <= searchResult.totalPages) {
      onPageChange(page);
      setPageInput(''); // Reset input sau khi chuyển trang
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleGoToPage();
    }
  };

  const handleExportExcel = async () => {
    if (!searchResult?.data?.length) return;
    
    try {
      setIsExporting(true);
      // Gọi API để lấy toàn bộ dữ liệu
      const fullData = await onExportExcel();

      // Chuẩn bị dữ liệu cho file Excel từ toàn bộ kết quả tìm kiếm
      const excelData = fullData.data?.map((row, index) => ({
        'STT': index + 1,
        'Ngày': row.ngay,
        'Mã E1': row.mae1,
        'Khối lượng (g)': row.khoiluong,
        'Mã Bưu cục đóng': row.mabcDong,
        'Mã Bưu cục nhận': row.mabcNhan,
        'Chuyến thư': row.chthu,
        'Túi số': row.tuiso
      })) || [];

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách E1');

      // Tạo tên file với timestamp
      const fileName = `danh_sach_e1_${new Date().toISOString().slice(0,19).replace(/[:]/g, '')}.xlsx`;

      // Xuất file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card sx={{ width: '100%' }}>
      <CardHeader 
        title="Kết quả tìm kiếm" 
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          '& .MuiCardHeader-content': {
            overflow: 'hidden'
          }
        }}
      />
      <CardContent>
        {!isLoading && searchResult && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1">
                Tổng số E1: {searchResult.totalCount} — Tổng KL: {searchResult.totalWeight}g
              </Typography>
              <span>
                <Tooltip title="Xuất danh sách E1">
                  <span>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<FileDownloadIcon />}
                      onClick={handleExportExcel}
                      disabled={!searchResult.data?.length || isExporting}
                    >
                      {isExporting ? 'Đang xuất...' : 'Xuất Excel'}
                    </Button>
                  </span>
                </Tooltip>
              </span>
            </Box>

            <TableContainer component={Paper} elevation={0} variant="outlined">
              <Table size="small" sx={{ minWidth: 350 }}>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      sx={{ 
                        minWidth: 100,
                        fontWeight: 'bold'
                      }}
                    >
                      Ngày
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        minWidth: 150,
                        fontWeight: 'bold' 
                      }}
                    >
                      Mã E1
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        minWidth: 80,
                        fontWeight: 'bold',
                        textAlign: 'right'
                      }}
                    >
                      KL (g)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchResult.data?.map((row) => (
                    <TableRow 
                      key={row.mae1}
                      hover
                      sx={{ 
                        cursor: 'pointer',
                        '&:last-child td, &:last-child th': { border: 0 } // remove border for the last row
                      }}
                      onClick={() => onSelectE1(row)}
                    >
                      <TableCell
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {row.ngay}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: 'primary.main',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {row.mae1}
                      </TableCell>
                      <TableCell
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textAlign: 'right'
                        }}
                      >
                        {row.khoiluong}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
              <Pagination
                count={searchResult.totalPages || 1}
                page={searchResult.currentPage || 1}
                onChange={(_e, page) => onPageChange(page)}
                color="primary"
                size="small"
              />
              {searchResult.totalPages && searchResult.totalPages > 1 && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <TextField
                    size="small"
                    placeholder="Trang"
                    value={pageInput}
                    onChange={handlePageInputChange}
                    onKeyPress={handleKeyPress}
                    sx={{ width: 70 }}
                    inputProps={{
                      style: { textAlign: 'center' },
                      'aria-label': 'Nhập số trang'
                    }}
                  />
                  <span>
                    <Tooltip title="Đi đến trang">
                      <span>
                        <IconButton 
                          size="small" 
                          onClick={handleGoToPage}
                          disabled={(() => {
                            if (!pageInput) return true;
                            const pageNum = parseInt(pageInput);
                            if (isNaN(pageNum) || pageNum < 1) return true;
                            if (searchResult.totalPages && pageNum > searchResult.totalPages) return true;
                            return false;
                          })()}
                        >
                          <NavigateNextIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </span>
                </Box>
              )}
            </Box>
          </>
        )}

        {!isLoading && !searchResult && (
          <Typography variant="body2">Nhập thông tin tìm kiếm và bấm Tìm kiếm</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchResults;
