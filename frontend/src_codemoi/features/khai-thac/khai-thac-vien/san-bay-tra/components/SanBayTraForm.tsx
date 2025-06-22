// src/features/khai-thac/khai-thac-vien/san-bay-tra/components/SanBayTraForm.tsx

import { Box, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';

interface SanBayTraFormProps {
  fromDate: Date;
  toDate: Date;
  setFromDate: (date: Date) => void;
  setToDate: (date: Date) => void;
  lanlap: number;
  setLanlap: (lanlap: number) => void;
  cakt: number;
  setCakt: (cakt: number) => void;
}

const SanBayTraForm = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  lanlap,
  setLanlap,
  cakt,
  setCakt,
}: SanBayTraFormProps) => {
  return (
    <Box mb={2} display="flex" gap={2} alignItems="center" flexWrap="wrap">
      <DatePicker
        label="Từ ngày"
        value={fromDate}
        onChange={(date) => date && setFromDate(date)}
      />
      <DatePicker label="Đến ngày" value={toDate} onChange={(date) => date && setToDate(date)} />

      <TextField
        label="Lần lập"
        type="number"
        value={lanlap}
        onChange={(e) => setLanlap(Number(e.target.value))}
      />

      <TextField
        label="Ca KT"
        select
        SelectProps={{ native: true }}
        value={cakt}
        onChange={(e) => setCakt(Number(e.target.value))}
      >
        <option value={1}>Ca 1</option>
        <option value={2}>Ca 2</option>
      </TextField>
    </Box>
  );
};

export default SanBayTraForm;
