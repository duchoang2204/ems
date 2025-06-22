import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { PosService } from '../services/pos.service';

@injectable()
export class PosController {
  constructor(@inject(PosService) private posService: PosService) {}

  async getName(req: Request, res: Response): Promise<void> {
    try {
      const { posCode } = req.params;
      const name = await this.posService.getPosName(posCode);
      if (name) {
        res.json({ success: true, name });
      } else {
        res.status(404).json({ success: false, message: 'POS not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
} 