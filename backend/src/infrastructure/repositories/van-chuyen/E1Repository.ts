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
    return {
      data: [
        {
          mae1: 'E123456789VN',
          ngay: '20250612',
          mabcDong: request.mabcDong || '',
          mabcNhan: request.mabcNhan || '',
          chthu: request.chthu || '',
          tuiso: request.tuiso || '',
          khoiluong: request.khoiluong || '',
        }
      ],
      totalCount: 1,
      totalWeight: Number(request.khoiluong) || 1000,
      currentPage: request.page || 1,
      totalPages: 1
    };
  }

  async getE1Details(request: GetE1DetailsRequestDto): Promise<GetE1DetailsResponseDto> {
    // TODO: Implement SQL Server query
    throw new Error('Method not implemented.');
  }
} 