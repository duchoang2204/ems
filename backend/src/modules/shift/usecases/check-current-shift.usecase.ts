import { injectable, inject } from 'tsyringe';
import { ShiftService, CheckShiftResult } from '../services/shift.service';
import { SHIFT_TOKENS } from '../di/tokens';

@injectable()
export class CheckCurrentShiftUseCase {
  constructor(
    @inject(SHIFT_TOKENS.ShiftService) private shiftService: ShiftService
  ) {}

  async execute(g_mabc: string): Promise<CheckShiftResult> {
    const tStart = Date.now();
    console.log('[SHIFT][UseCase] Bắt đầu xử lý check ca');
    const now = new Date();
    const yyyymmdd = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    const hhmm = now.getHours() * 100 + now.getMinutes();
    const tCheckStart = Date.now();
    const result = await this.shiftService.checkShiftValid(g_mabc, yyyymmdd, hhmm);
    const tCheckEnd = Date.now();
    console.log(`[SHIFT][UseCase] Thời gian gọi shiftService.checkShiftValid: ${tCheckEnd - tCheckStart} ms`);
    const tEnd = Date.now();
    console.log(`[SHIFT][UseCase] Tổng thời gian thực thi usecase: ${tEnd - tStart} ms`);
    return result;
  }
} 