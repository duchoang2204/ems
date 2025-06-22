// src/features/khai-thac/khai-thac-vien/san-bay-tra/components/CardDanhSachMaE1.tsx

import { Box, Card, CardContent, Typography } from '@mui/material';
import { TuiKien } from '../types/TuiKien.types';
import { useDanhSachMaE1 } from '../hooks/useDanhSachMaE1';

interface CardDanhSachMaE1Props {
  hoveredTuiKien: TuiKien | null;
}

const CardDanhSachMaE1 = ({ hoveredTuiKien }: CardDanhSachMaE1Props) => {
  const { data: danhSachMaE1 = [], isLoading } = useDanhSachMaE1(hoveredTuiKien);

  return (
    <Card sx={{ flex: 1, height: '600px', overflow: 'auto' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Danh sách mã E1
        </Typography>

        {isLoading && <Typography variant="body2">Đang tải...</Typography>}

        {danhSachMaE1.map((item, index) => (
          <Box
            key={index}
            mb={1}
            p={1}
            border="1px solid #ccc"
            borderRadius={2}
            bgcolor="#f9f9f9"
          >
            <Typography variant="subtitle1">{item.mae1}</Typography>
            <Typography variant="body2">KL: {item.khoiluong} - Ghi chú: {item.ghichu}</Typography>
            <Typography variant="body2">Hành trình: {item.hanhtrinh}</Typography>
            <Typography variant="body2">ND bưu phẩm: {item.noidung}</Typography>
            <Typography variant="body2">Trạng thái: {item.trangthai}</Typography>
          </Box>
        ))}

        {!isLoading && danhSachMaE1.length === 0 && (
          <Typography variant="body2">Không có mã E1 nào.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CardDanhSachMaE1;
