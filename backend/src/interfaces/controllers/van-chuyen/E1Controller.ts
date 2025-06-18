import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { SearchE1UseCase } from '../../../application/use-cases/van-chuyen/SearchE1UseCase';
import { GetE1DetailsUseCase } from '../../../application/use-cases/van-chuyen/GetE1DetailsUseCase';
import { SearchE1RequestDto } from '../../../application/dto/van-chuyen/SearchE1RequestDto';
import { GetE1DetailsRequestDto } from '../../../application/dto/van-chuyen/GetE1DetailsRequestDto';

@injectable()
export class E1Controller {
  constructor(
    @inject(SearchE1UseCase) private searchE1UseCase: SearchE1UseCase,
    @inject(GetE1DetailsUseCase) private getE1DetailsUseCase: GetE1DetailsUseCase
  ) {}

  async searchE1(req: Request, res: Response): Promise<void> {
    try {
      const request = new SearchE1RequestDto();
      Object.assign(request, req.query);
      
      const result = await this.searchE1UseCase.execute(request);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  }

  async getE1Details(req: Request, res: Response): Promise<void> {
    try {
      const request = new GetE1DetailsRequestDto();
      Object.assign(request, req.query);
      
      const result = await this.getE1DetailsUseCase.execute(request);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Internal server error' });
    }
  }
} 