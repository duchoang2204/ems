import React, { useMemo } from 'react';
import {
  Card, CardHeader, CardContent, Table, TableHead, TableRow, TableCell, TableBody,
  Typography, Paper, Divider, Box
} from '@mui/material';
import { format as formatDate } from 'date-fns';
import type { E1DetailInfo, E1BD10Info } from '../types/vanChuyen.types';
import { usePosNames } from '../../../hooks/usePosNames';

interface Props {
  selectedE1: string | null;
  e1Details: E1DetailInfo[];
  bd10Details: E1BD10Info[];
  isLoading?: boolean;
}

const E1Details: React.FC<Props> = (props) => {
  const { selectedE1, e1Details, bd10Details, isLoading } = props;

  const sortedE1Details = useMemo(() => {
    if (!e1Details) return [];
    // Sắp xếp dựa trên chuỗi ISO 8601, không cần parse phức tạp
    return [...e1Details].sort((a, b) => a.eventTimestamp.localeCompare(b.eventTimestamp));
  }, [e1Details]);

  const posCodesToFetch = useMemo(() => {
    // Phải dùng e1Details gốc, không phải sortedE1Details để tránh lặp lại useMemo
    return e1Details.flatMap(detail => [detail.buuCucDong, detail.buuCucNhan]);
  }, [e1Details]);

  const { posNames } = usePosNames(posCodesToFetch);

  const getRowStyle = (loai: string) => {
    // HNLT: 100916
    if (loai.includes('(HNLT)')) {
      return { backgroundColor: '#fff3e0' }; // Material UI Orange 50
    }
    // HNNT: 101000
    if (loai.includes('(HNNT)')) {
      return { backgroundColor: '#fffde7' }; // Material UI Yellow 50 (nhạt hơn)
    }
    // Mặc định cho HCM, Quá Giang, etc.
    return {};
  };

  const getTypeStyle = (loai: string) => {
    // Chỉ áp dụng màu sắc, không thay đổi font weight để đồng bộ.
    if (loai.startsWith('Đi')) {
      return { color: 'success.main' }; // Green
    }
    if (loai.startsWith('XNĐ')) {
      return { color: 'error.main' }; // Red
    }
    if (loai.startsWith('Đến')) {
      return { color: 'warning.dark' }; // Orange/Amber
    }
    return {};
  };

  const headerCellStyle = {
    backgroundColor: '#343a40',
    color: '#ffffff',
    fontWeight: 'bold',
    border: `1px solid #495057`,
    textAlign: 'center',
    padding: '12px 16px',
    verticalAlign: 'middle',
  };

  const bodyCellStyle = {
    color: '#212529',
    border: `1px solid #868e96`,
    padding: '12px 16px',
    textAlign: 'center',
    verticalAlign: 'middle',
  };

  if (!selectedE1) {
    return (
      <Card>
        <CardContent>
          <Typography>Chọn một mã E1 từ kết quả tìm kiếm để xem chi tiết</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ width: '100%', minWidth: 600 }}>
      <CardHeader 
        title={`Chi tiết E1: ${selectedE1}`}
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          '& .MuiCardHeader-content': {
            overflow: 'hidden'
          }
        }}
      />
      <CardContent>
        {isLoading ? (
          <Typography textAlign="center" sx={{ my: 4 }}>
            Đang tải dữ liệu...
          </Typography>
        ) : (
          <>
            {/* Thông tin chuyến thư */}
            <Paper elevation={0} variant="outlined" sx={{ mb: 3, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin chuyến thư
              </Typography>
              <Table size="small" sx={{ borderCollapse: 'collapse' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={headerCellStyle}>STT</TableCell>
                    <TableCell sx={headerCellStyle}>Thời gian CT</TableCell>
                    <TableCell sx={headerCellStyle}>Trạng thái</TableCell>
                    <TableCell sx={headerCellStyle}>Bưu cục đóng</TableCell>
                    <TableCell sx={headerCellStyle}>Bưu cục nhận</TableCell>
                    <TableCell sx={headerCellStyle}>Thông tin CT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedE1Details.map((detail) => (
                    <TableRow 
                      key={detail.stt}
                      sx={getRowStyle(detail.loai)}
                    >
                      <TableCell sx={bodyCellStyle}>{detail.stt}</TableCell>
                      <TableCell sx={bodyCellStyle}>
                        {formatDate(new Date(detail.eventTimestamp), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellStyle }}>
                        <Typography component="span" sx={getTypeStyle(detail.loai)}>
                          {detail.loai}
                        </Typography>
                      </TableCell>
                      <TableCell sx={bodyCellStyle}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Typography variant="body2">{detail.buuCucDong}</Typography>
                          {posNames[detail.buuCucDong] && (
                            <Typography variant="caption">
                              {posNames[detail.buuCucDong]}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={bodyCellStyle}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Typography variant="body2">{detail.buuCucNhan}</Typography>
                          {posNames[detail.buuCucNhan] && (
                            <Typography variant="caption">
                              {posNames[detail.buuCucNhan]}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{...bodyCellStyle, textAlign: 'left' }}>{detail.thongTinCT}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            <Divider sx={{ my: 3 }} />

            {/* Thông tin BD10 */}
            <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin giao nhận BD10
              </Typography>
              <Table size="small" sx={{ borderCollapse: 'collapse' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={headerCellStyle}>STT</TableCell>
                    <TableCell sx={headerCellStyle}>Ngày BĐ10</TableCell>
                    <TableCell sx={headerCellStyle}>Thời gian BĐ10</TableCell>
                    <TableCell sx={headerCellStyle}>Trạng thái</TableCell>
                    <TableCell sx={headerCellStyle}>Bưu cục giao</TableCell>
                    <TableCell sx={headerCellStyle}>Bưu cục nhận</TableCell>
                    <TableCell sx={headerCellStyle}>Lần lập/Mã BĐ10</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Dữ liệu mẫu - sẽ được thay thế khi có API */}
                  {bd10Details.map((detail) => (
                    <TableRow key={detail.stt}>
                      <TableCell sx={bodyCellStyle}>{detail.stt}</TableCell>
                      <TableCell sx={bodyCellStyle}>{detail.ngayBD10}</TableCell>
                      <TableCell sx={bodyCellStyle}>{/* Thời gian BĐ10 */}</TableCell>
                      <TableCell sx={bodyCellStyle}>{/* Trạng thái */}</TableCell>
                      <TableCell sx={bodyCellStyle}>{detail.buuCucGiao}</TableCell>
                      <TableCell sx={bodyCellStyle}>{detail.buuCucNhan}</TableCell>
                      <TableCell sx={bodyCellStyle}>{detail.lanLapMaBD10}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default E1Details;
