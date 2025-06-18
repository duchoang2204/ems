// Component SearchForm → nhập các thông số search E1
// Dùng Form → parent component truyền props: onSearch()

import React from 'react';
import { Grid, TextField, Button } from '@mui/material';
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
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <DatePicker
            label="Từ ngày"
            value={fromDate}
            onChange={(value) => onChangeField('fromDate', value)}
            slotProps={{
              textField: {
                fullWidth: true, 
                size: 'small',
                autoComplete: 'from-date'
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DatePicker
            label="Đến ngày"
            value={toDate}
            onChange={(value) => onChangeField('toDate', value)}
            slotProps={{
              textField: {
                fullWidth: true, 
                size: 'small',
                autoComplete: 'to-date'
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Mã bưu cục đóng"
            value={mabcDong || ''}
            onChange={(e) => handleNumberInput('mabcDong', e.target.value)}
            inputProps={{ 
              inputMode: 'numeric', 
              pattern: '[0-9]*',
              'data-field': 'mabc-dong'
            }}
            fullWidth
            size="small"
            autoComplete="postal-code-from"
            name="mabc-dong"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Mã bưu cục nhận"
            value={mabcNhan || ''}
            onChange={(e) => handleNumberInput('mabcNhan', e.target.value)}
            inputProps={{ 
              inputMode: 'numeric', 
              pattern: '[0-9]*',
              'data-field': 'mabc-nhan'
            }}
            fullWidth
            size="small"
            autoComplete="postal-code-to"
            name="mabc-nhan"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Chuyến thư"
            value={chthu || ''}
            onChange={(e) => handleNumberInput('chthu', e.target.value)}
            inputProps={{ 
              inputMode: 'numeric', 
              pattern: '[0-9]*',
              'data-field': 'chuyen-thu'
            }}
            fullWidth
            size="small"
            autoComplete="mail-trip"
            name="chuyen-thu"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Túi số"
            value={tuiso || ''}
            onChange={(e) => handleNumberInput('tuiso', e.target.value)}
            inputProps={{ 
              inputMode: 'numeric', 
              pattern: '[0-9]*',
              'data-field': 'tui-so'
            }}
            fullWidth
            size="small"
            autoComplete="bag-number"
            name="tui-so"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Khối lượng"
            value={khoiluong || ''}
            onChange={(e) => handleNumberInput('khoiluong', e.target.value)}
            inputProps={{ 
              inputMode: 'decimal', 
              step: "0.1",
              'data-field': 'khoi-luong'
            }}
            fullWidth
            size="small"
            autoComplete="weight"
            name="khoi-luong"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={onSearch} 
            disabled={isLoading || !canSearch()}
          >
            {isLoading ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
          </Button>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default SearchForm;
