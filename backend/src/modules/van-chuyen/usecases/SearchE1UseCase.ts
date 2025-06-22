import { injectable, inject } from 'tsyringe';
import { IE1Repository } from '../domain/repositories/IE1Repository';
import { SearchE1RequestDto } from '../dto/SearchE1RequestDto';
import { SearchE1ResponseDto } from '../dto/SearchE1ResponseDto';
import { VAN_CHUYEN_TOKENS } from '../di/tokens';

@injectable()
export class SearchE1UseCase {
  constructor(
    @inject(VAN_CHUYEN_TOKENS.E1Repository) private e1Repository: IE1Repository
  ) {}

  async execute(request: SearchE1RequestDto): Promise<SearchE1ResponseDto> {
    return this.e1Repository.searchE1(request);
  }
} 