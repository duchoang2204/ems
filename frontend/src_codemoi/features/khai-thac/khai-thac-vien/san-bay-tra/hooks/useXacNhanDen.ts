// src/features/khai-thac/khai-thac-vien/san-bay-tra/hooks/useXacNhanDen.ts

import { useMutation } from '@tanstack/react-query';
import { xacNhanDen } from '../api/xacNhanDen';

export const useXacNhanDen = () => {
  return useMutation({
    mutationFn: xacNhanDen,
  });
};
