import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CheckCurrentShiftUseCase } from '../usecases/check-current-shift.usecase';

@injectable()
export class ShiftController {
  constructor(private checkCurrentShiftUseCase: CheckCurrentShiftUseCase) {}

  async checkCurrentShift(req: Request, res: Response) {
    try {      
      const { g_mabc } = req.body;
      const result = await this.checkCurrentShiftUseCase.execute(g_mabc);
      res.json(result); // result: { ok, msg, shift }
    } catch (err: any) {
      console.error('Lỗi tại ShiftController:', err);
      res.status(500).json({ ok: false, msg: err.message });
    }
  }
} 