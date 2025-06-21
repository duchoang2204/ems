import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { PosNameService } from '../../../shared/pos/pos-name.service';

@injectable()
export class PosController {
  constructor(
    @inject(PosNameService) private posNameService: PosNameService
  ) {}

  async getNames(req: Request, res: Response): Promise<void> {
    try {
      const { posCodes } = req.body;
      if (!Array.isArray(posCodes) || posCodes.length === 0) {
        res.status(400).json({ message: 'posCodes must be a non-empty array.' });
        return;
      }
      
      const uniquePosCodes = [...new Set(posCodes.filter(Boolean))];
      const namesMap: Record<string, string> = {};
      
      const promises = uniquePosCodes.map(async (code) => {
        const name = await this.posNameService.getPosName(code);
        namesMap[code] = name;
      });

      await Promise.all(promises);
      res.json(namesMap);

    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  }
} 