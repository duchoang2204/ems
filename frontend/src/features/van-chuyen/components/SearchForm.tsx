// Component SearchForm → nhập các thông số search E1
// Dùng Form → parent component truyền props: onSearch()

import React from 'react';
import { TextField, Button, Stack } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; 

interface Props {
  fromDate: Date | null;
  toDate: Date | null;
  mabcDong: string;
  mabcNhan: string;
  chthu: string;
  tuiso: string;
  khoiluong?: string;
  onChangeField: (field: string, value: string | number | Date | null) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const SearchForm: React.FC<Props> = (props) => {
  const {
    fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong = '', onChangeField, onSearch, isLoading
  } = props;

  // Hàm xử lý nhập số
  const handleNumberInput = (field: string, value: string) => {
    // Nếu rỗng, gửi chuỗi rỗng thay vì null
    if (!value.trim()) {
      onChangeField(field, '');
      return;
    }
    
    // Chỉ cho phép nhập số và dấu chấm
    if (!/^\d*\.?\d*$/.test(value)) return;

    onChangeField(field, value);
  };

  // Kiểm tra xem có thể tìm kiếm không
  const canSearch = () => {
    // Phải có ít nhất một trong các trường sau có giá trị
    return mabcDong !== '' || 
           mabcNhan !== '' || 
           chthu !== '' || 
           tuiso !== '' ||
           khoiluong !== '';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <TextField
          label="Mã bưu cục đóng"
          name="mabcDong"
          value={mabcDong || ''}
          onChange={(e) => handleNumberInput('mabcDong', e.target.value)}
          disabled={isLoading}
          inputProps={{ 
            inputMode: 'numeric', 
            pattern: '[0-9]*',
          }}
          size="small"
          autoFocus
          sx={{ minWidth: 140, flex: 1 }}
        />
        <TextField
          label="Mã bưu cục nhận"
          name="mabcNhan"
          value={mabcNhan || ''}
          onChange={(e) => handleNumberInput('mabcNhan', e.target.value)}
          disabled={isLoading}
          inputProps={{ 
            inputMode: 'numeric', 
            pattern: '[0-9]*',
          }}
          size="small"
          sx={{ minWidth: 140, flex: 1 }}
        />
        <TextField
          label="Chuyến thư"
          name="chthu"
          value={chthu || ''}
          onChange={(e) => handleNumberInput('chthu', e.target.value)}
          disabled={isLoading}
          inputProps={{ 
            inputMode: 'numeric', 
            pattern: '[0-9]*',
          }}
          size="small"
          sx={{ minWidth: 100, flex: 0.8 }}
        />
        <TextField
          label="Túi số"
          name="tuiso"
          value={tuiso || ''}
          onChange={(e) => handleNumberInput('tuiso', e.target.value)}
          disabled={isLoading}
          inputProps={{ 
            inputMode: 'numeric', 
            pattern: '[0-9]*',
          }}
          size="small"
          sx={{ minWidth: 100, flex: 0.8 }}
        />
        <TextField
          label="Khối lượng"
          name="khoiluong"
          value={khoiluong || ''}
          onChange={(e) => handleNumberInput('khoiluong', e.target.value)}
          disabled={isLoading}
          inputProps={{ 
            inputMode: 'decimal', 
            step: "0.1",
          }}
          size="small"
          sx={{ minWidth: 100, flex: 0.8 }}
        />
        <DatePicker
          label="Từ ngày"
          value={fromDate}
          onChange={(value) => onChangeField('fromDate', value)}
          disabled={isLoading}
          slotProps={{
            textField: {
              size: 'small',
            }
          }}
          sx={{ minWidth: 160, flex: 1 }}
        />
        <DatePicker
          label="Đến ngày"
          value={toDate}
          onChange={(value) => onChangeField('toDate', value)}
          disabled={isLoading}
          slotProps={{
            textField: {
              size: 'small',
            }
          }}
          sx={{ minWidth: 160, flex: 1 }}
        />
        <Button
          variant="contained"
          onClick={onSearch} 
          disabled={isLoading || !canSearch()}
          sx={{
            height: '40px', // Đồng bộ chiều cao với TextField size='small'
            flexShrink: 0,
          }}
        >
          {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
        </Button>
      </Stack>
    </LocalizationProvider>
  );
};

export default SearchForm;
