// Component hiển thị kết quả tìm kiếm E1
// props: list E1, tổng E1, tổng khối lượng, phân trang, onClick E1

import React, { useState } from 'react';
import {
  Card, CardHeader, CardContent, Table, TableHead, TableRow, TableCell, TableBody,
  Typography, Pagination, Box, TextField, IconButton, Tooltip, Divider, Button
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';
import type { SearchE1ResponseDto } from '../types/vanChuyen.types';

interface Props {
  searchResult: SearchE1ResponseDto | undefined;
  isLoading: boolean;
  onSelectE1: (mae1: string) => void;
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
    if (page && searchResult && page >= 1 && page <= searchResult.totalPages) {
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
    if (!searchResult?.data.length) return;
    
    try {
      setIsExporting(true);
      // Gọi API để lấy toàn bộ dữ liệu
      const fullData = await onExportExcel();

      // Chuẩn bị dữ liệu cho file Excel từ toàn bộ kết quả tìm kiếm
      const excelData = fullData.data.map((row, index) => ({
        'STT': index + 1,
        'Ngày': row.ngay,
        'Mã E1': row.mae1,
        'Khối lượng (g)': row.khoiluong,
        'Mã Bưu cục đóng': row.mabcDong,
        'Mã Bưu cục nhận': row.mabcNhan,
        'Chuyến thư': row.chthu,
        'Túi số': row.tuiso
      }));

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
    <Card sx={{ width: '100%', maxWidth: 400 }}>
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
                      disabled={!searchResult.data.length || isExporting}
                    >
                      {isExporting ? 'Đang xuất...' : 'Xuất Excel'}
                    </Button>
                  </span>
                </Tooltip>
              </span>
            </Box>

            <Table size="small" sx={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell 
                    width="30%" 
                    sx={{ 
                      borderRight: 1, 
                      borderColor: 'divider',
                      fontWeight: 'bold'
                    }}
                  >
                    Ngày
                  </TableCell>
                  <TableCell 
                    width="40%"
                    sx={{ 
                      borderRight: 1,
                      borderColor: 'divider',
                      fontWeight: 'bold' 
                    }}
                  >
                    Mã E1
                  </TableCell>
                  <TableCell 
                    width="30%"
                    sx={{ fontWeight: 'bold' }}
                  >
                    KL (g)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchResult.data.map((row) => (
                  <TableRow 
                    key={row.mae1}
                    hover
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                    onClick={() => onSelectE1(row.mae1)}
                  >
                    <TableCell 
                      sx={{ 
                        borderRight: 1, 
                        borderColor: 'divider',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {row.ngay}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: 1,
                        borderColor: 'divider',
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
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {row.khoiluong}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
              <Pagination
                count={searchResult.totalPages}
                page={searchResult.currentPage}
                onChange={(_e, page) => onPageChange(page)}
                color="primary"
                size="small"
              />
              {searchResult.totalPages > 1 && (
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
                          disabled={!pageInput || parseInt(pageInput) < 1 || parseInt(pageInput) > searchResult.totalPages}
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
