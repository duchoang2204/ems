import { injectable } from 'tsyringe';
import { IE1Repository } from '../../../domain/repositories/van-chuyen/IE1Repository';
import { SearchE1RequestDto } from '../../../application/dto/van-chuyen/SearchE1RequestDto';
import { SearchE1ResponseDto } from '../../../application/dto/van-chuyen/SearchE1ResponseDto';
import { GetE1DetailsRequestDto } from '../../../application/dto/van-chuyen/GetE1DetailsRequestDto';
import { GetE1DetailsResponseDto } from '../../../application/dto/van-chuyen/GetE1DetailsResponseDto';

@injectable()
export class E1Repository implements IE1Repository {
  constructor() {}

  async searchE1(request: SearchE1RequestDto): Promise<SearchE1ResponseDto> {
    // TODO: Implement SQL Server query
    throw new Error('Method not implemented.');
  }

  async getE1Details(request: GetE1DetailsRequestDto): Promise<GetE1DetailsResponseDto> {
    // TODO: Implement SQL Server query
    throw new Error('Method not implemented.');
  }
} 