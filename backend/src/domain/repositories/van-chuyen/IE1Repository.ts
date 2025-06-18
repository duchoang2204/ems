import { E1 } from '../../../domain/entities/van-chuyen/E1';
import { E1Detail } from '../../../domain/entities/van-chuyen/E1Detail';
import { SearchE1RequestDto } from '../../../application/dto/van-chuyen/SearchE1RequestDto';
import { SearchE1ResponseDto } from '../../../application/dto/van-chuyen/SearchE1ResponseDto';
import { GetE1DetailsRequestDto } from '../../../application/dto/van-chuyen/GetE1DetailsRequestDto';
import { GetE1DetailsResponseDto } from '../../../application/dto/van-chuyen/GetE1DetailsResponseDto';

export interface IE1Repository {
  searchE1(request: SearchE1RequestDto): Promise<SearchE1ResponseDto>;
  getE1Details(request: GetE1DetailsRequestDto): Promise<GetE1DetailsResponseDto>;
} 