// src/features/khai-thac/khai-thac-vien/san-bay-tra/components/ToolbarButtons.tsx

import { Box, Button } from '@mui/material';

interface ToolbarButtonsProps {
  onXacNhanDen: () => void;
  isLoading: boolean;
}

const ToolbarButtons = ({ onXacNhanDen, isLoading }: ToolbarButtonsProps) => {
  return (
    <Box mt={2} display="flex" gap={2}>
      <Button variant="contained" color="primary" onClick={onXacNhanDen} disabled={isLoading}>
        Xác nhận đến
      </Button>

      <Button variant="outlined" color="secondary" disabled>
        Điều chỉnh nội dung E1 (Tạm)
      </Button>

      <Button variant="outlined" color="secondary" disabled>
        Lập biên bản (Tạm)
      </Button>
    </Box>
  );
};

export default ToolbarButtons;
