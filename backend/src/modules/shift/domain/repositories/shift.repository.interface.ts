import { Shift } from '../entities/shift.entity';

export interface IShiftRepository {
  findCurrentShift(g_mabc: string): Promise<Shift | null>;
  findById(g_mabc: string, idCa: number): Promise<Shift | null>;
  findActiveShift(g_mabc: string): Promise<Shift | null>;
  // Có thể bổ sung các hàm khác nếu cần
} 