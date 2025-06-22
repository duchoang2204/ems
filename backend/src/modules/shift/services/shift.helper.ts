import { container } from 'tsyringe';
import { ShiftService } from './shift.service';

export async function checkShiftValid(g_mabc: string, yyyymmdd: number, hhmm: number) {
  const shiftService = container.resolve(ShiftService);
  return await shiftService.checkShiftValid(g_mabc, yyyymmdd, hhmm);
} 