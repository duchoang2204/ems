import { injectable, inject } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
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

  async searchE1(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestDto: SearchE1RequestDto = req.body;
      const result = await this.searchE1UseCase.execute(requestDto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getE1Details(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestDto: GetE1DetailsRequestDto = req.body;
      const result = await this.getE1DetailsUseCase.execute(requestDto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
} 