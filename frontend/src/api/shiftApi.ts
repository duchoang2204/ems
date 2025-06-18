import axiosInstance from './axiosConfig';
import type { Shift } from '../types/shift.interface';

export interface CheckShiftResponse {
  ok: boolean;
  msg?: string;
  shift?: Shift;
}

export const checkShift = async (g_mabc: string): Promise<CheckShiftResponse> => {
  const res = await axiosInstance.post('/shift/check-current', { g_mabc });
  return res.data as CheckShiftResponse;
};
