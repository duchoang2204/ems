import { injectable, inject } from 'tsyringe';
import { IE1Repository } from '../../../domain/repositories/van-chuyen/IE1Repository';
import { SearchE1RequestDto } from '../../dto/van-chuyen/SearchE1RequestDto';
import { SearchE1ResponseDto } from '../../dto/van-chuyen/SearchE1ResponseDto';

@injectable()
export class SearchE1UseCase {
  constructor(
    @inject('E1Repository') private e1Repository: IE1Repository
  ) {}

  async execute(request: SearchE1RequestDto): Promise<SearchE1ResponseDto> {
    return this.e1Repository.searchE1(request);
  }
} 