// src/features/khai-thac/khai-thac-vien/san-bay-tra/components/CardDanhSachTuiKien.tsx

import { Box, Card, CardContent, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { TuiKien } from '../types/TuiKien.types';
import { updateIschon } from '../api/updateIschon';

interface CardDanhSachTuiKienProps {
  selectedTuiKien: TuiKien[];
  setSelectedTuiKien: (tuiKien: TuiKien[]) => void;
  danhSachTuiKien: TuiKien[];
  onHoverTuiKien: (tui: TuiKien | null) => void;
}

const CardDanhSachTuiKien = ({
  selectedTuiKien,
  setSelectedTuiKien,
  danhSachTuiKien,
  onHoverTuiKien,
}: CardDanhSachTuiKienProps) => {
  const handleCheckboxChange = async (item: TuiKien) => {
    const isSelected = !!selectedTuiKien.find(
      (tk) =>
        tk.mabc_kt === item.mabc_kt &&
        tk.mabc === item.mabc &&
        tk.chthu === item.chthu &&
        tk.tuiso === item.tuiso
    );

    // Gọi API updateIschon
    await updateIschon({
      ngay: item.ngay,
      mabc_kt: item.mabc_kt,
      mabc: item.mabc,
      chthu: item.chthu,
      tuiso: item.tuiso,
      id_e2: item.id_e2,
      ischon: isSelected ? 0 : 1,
    });

    // Update state selectedTuiKien
    if (isSelected) {
      setSelectedTuiKien(
        selectedTuiKien.filter(
          (tk) =>
            !(
              tk.mabc_kt === item.mabc_kt &&
              tk.mabc === item.mabc &&
              tk.chthu === item.chthu &&
              tk.tuiso === item.tuiso
            )
        )
      );
    } else {
      setSelectedTuiKien([...selectedTuiKien, { ...item, ischon: 1 }]);
    }
  };

  return (
    <Card sx={{ flex: 1, height: '600px', overflow: 'auto' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Danh sách túi/kiện
        </Typography>
        {danhSachTuiKien.map((item, index) => {
          const isChecked = !!selectedTuiKien.find(
            (tk) =>
              tk.mabc_kt === item.mabc_kt &&
              tk.mabc === item.mabc &&
              tk.chthu === item.chthu &&
              tk.tuiso === item.tuiso
          );

          return (
            <Box
              key={index}
              mb={1}
              p={1}
              border="1px solid #ccc"
              borderRadius={2}
              onMouseEnter={() => onHoverTuiKien(item)}
              onMouseLeave={() => onHoverTuiKien(null)}
              bgcolor={isChecked ? '#e0f7fa' : undefined}
            >
              <FormControlLabel
                control={
                  <Checkbox checked={isChecked} onChange={() => handleCheckboxChange(item)} />
                }
                label={`E4: ${item.id_e2} - BC Đóng: ${item.mabc_kt} - BC Nhận: ${item.mabc} - Chuyến: ${item.chthu} - Túi: ${item.tuiso} - KL: ${item.khoiluong}`}
              />
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default CardDanhSachTuiKien;
