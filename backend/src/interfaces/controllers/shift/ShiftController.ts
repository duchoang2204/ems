import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CheckCurrentShiftUseCase } from '../../../application/use-cases/shift/CheckCurrentShiftUseCase';

@injectable()
export class ShiftController {
  constructor(private checkCurrentShiftUseCase: CheckCurrentShiftUseCase) {}

  async checkCurrentShift(req: Request, res: Response) {
    try {
      console.log('API /api/shift/check-current nhận request:', req.body);
      const { g_mabc } = req.body;
      const result = await this.checkCurrentShiftUseCase.execute(g_mabc);
      res.json(result); // result: { ok, msg, shift }
    } catch (err: any) {
      console.error('Lỗi tại ShiftController:', err);
      res.status(500).json({ ok: false, msg: err.message });
    }
  }
} 