import { injectable, inject } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { SearchE1UseCase } from '../usecases/SearchE1UseCase';
import { GetE1DetailsUseCase } from '../usecases/GetE1DetailsUseCase';
import { SearchE1RequestDto } from '../dto/SearchE1RequestDto';
import { GetE1DetailsRequestDto } from '../dto/GetE1DetailsRequestDto';
import { VAN_CHUYEN_TOKENS } from '../di/tokens';

@injectable()
export class E1Controller {
  constructor(
    @inject(VAN_CHUYEN_TOKENS.SearchE1UseCase) private searchE1UseCase: SearchE1UseCase,
    @inject(VAN_CHUYEN_TOKENS.GetE1DetailsUseCase) private getE1DetailsUseCase: GetE1DetailsUseCase
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