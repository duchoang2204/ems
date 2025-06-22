import { injectable, inject } from 'tsyringe';
import { IPosRepository } from '../domain/repositories/pos.repository.interface';

@injectable()
export class PosService {
  constructor(
    @inject(IPosRepository) private readonly posRepository: IPosRepository
  ) {}

  async getPosName(posCode: string): Promise<string | null> {
    return this.posRepository.findNameByCode(posCode);
  }
} 