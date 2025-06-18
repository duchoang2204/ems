import { injectable, inject } from 'tsyringe';
import { ShiftService, CheckShiftResult } from '../../../domain/services/shift/ShiftService';

@injectable()
export class CheckCurrentShiftUseCase {
  constructor(
    @inject(ShiftService) private shiftService: ShiftService
  ) {}

  async execute(g_mabc: string): Promise<CheckShiftResult> {
    const now = new Date();
    const yyyymmdd = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    const hhmm = now.getHours() * 100 + now.getMinutes();
    return await this.shiftService.checkShiftValid(g_mabc, yyyymmdd, hhmm);
  }
} 