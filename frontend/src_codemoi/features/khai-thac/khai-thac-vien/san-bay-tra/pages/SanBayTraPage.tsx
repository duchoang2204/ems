// src/features/khai-thac/khai-thac-vien/san-bay-tra/pages/SanBayTraPage.tsx

import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useXacNhanDen } from '../hooks/useXacNhanDen';
import CardDanhSachTuiKien from '../components/CardDanhSachTuiKien';
import CardDanhSachMaE1 from '../components/CardDanhSachMaE1';
import { TuiKien } from '../types/TuiKien.types';

const SanBayTraPage = () => {
  const [selectedTuiKien, setSelectedTuiKien] = useState<TuiKien[]>([]);
  const [hoveredTuiKien, setHoveredTuiKien] = useState<TuiKien | null>(null);

  const { mutate: xacNhanDen, isLoading } = useXacNhanDen();

  const handleXacNhan = () => {
    const payload = {
      lanlap: 1, // lấy từ form hoặc mặc định
      ngaykt: Number(sessionStorage.getItem('ngaykt') || '20250612'),
      cakt: Number(sessionStorage.getItem('cakt') || '1'),
      manv: Number(sessionStorage.getItem('manv') || '10001'),
      listTuiKien: selectedTuiKien.map((item) => ({
        ...item,
        ischon: item.ischon ? 1 : 0,
      })),
    };

    xacNhanDen(payload);
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Xác nhận đến - Sân bay trả
      </Typography>

      <Box display="flex" gap={2}>
        <CardDanhSachTuiKien
          selectedTuiKien={selectedTuiKien}
          setSelectedTuiKien={setSelectedTuiKien}
          onHoverTuiKien={setHoveredTuiKien}
        />
        <CardDanhSachMaE1 hoveredTuiKien={hoveredTuiKien} />
      </Box>

      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleXacNhan} disabled={isLoading}>
          Xác nhận đến
        </Button>
      </Box>
    </Box>
  );
};

export default SanBayTraPage;
