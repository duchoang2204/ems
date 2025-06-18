import React from 'react';
import {
  Card, CardHeader, CardContent, Table, TableHead, TableRow, TableCell, TableBody,
  Typography, Paper, Divider, Chip, Box
} from '@mui/material';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMadeIcon from '@mui/icons-material/CallMade';
import type { E1DetailInfo, E1BD10Info } from '../types/vanChuyen.types';

interface Props {
  selectedE1: string | null;
  e1Details: E1DetailInfo[];
  bd10Details: E1BD10Info[];
  isLoading?: boolean;
}

const E1Details: React.FC<Props> = (props) => {
  const { selectedE1, e1Details, bd10Details, isLoading } = props;

  const getDirectionIcon = (direction: 'DEN' | 'DI') => {
    return direction === 'DEN' ? (
      <CallReceivedIcon fontSize="small" color="success" />
    ) : (
      <CallMadeIcon fontSize="small" color="primary" />
    );
  };

  const getTableTypeChip = (type: 'LIEN_TINH' | 'NOI_TINH', isSpecial: boolean) => {
    return (
      <Chip
        size="small"
        label={type === 'LIEN_TINH' ? 'Liên Tỉnh' : 'Nội Tỉnh'}
        color={isSpecial ? 'secondary' : 'default'}
        variant={isSpecial ? 'filled' : 'outlined'}
      />
    );
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
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Ngày CT</TableCell>
                    <TableCell>Giờ CT</TableCell>
                    <TableCell>Bưu cục đóng</TableCell>
                    <TableCell>Bưu cục nhận</TableCell>
                    <TableCell>Thông tin CT</TableCell>
                    <TableCell align="center">Loại</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {e1Details.map((detail) => (
                    <TableRow key={detail.stt}>
                      <TableCell>{detail.stt}</TableCell>
                      <TableCell>{detail.ngayCT}</TableCell>
                      <TableCell>{detail.gioCT}</TableCell>
                      <TableCell>{detail.buuCucDong}</TableCell>
                      <TableCell>{detail.buuCucNhan}</TableCell>
                      <TableCell>{detail.thongTinCT}</TableCell>
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                          {getDirectionIcon(detail.direction)}
                          {getTableTypeChip(detail.tableType, detail.isSpecialTable)}
                        </Box>
                      </TableCell>
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
  );
};

export default E1Details;
