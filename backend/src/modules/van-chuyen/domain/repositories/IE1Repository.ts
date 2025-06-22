import { E1 } from '../entities/E1';
import { E1Detail } from '../entities/E1Detail';
import { SearchE1RequestDto } from '../../dto/SearchE1RequestDto';
import { SearchE1ResponseDto } from '../../dto/SearchE1ResponseDto';
import { GetE1DetailsRequestDto } from '../../dto/GetE1DetailsRequestDto';
import { GetE1DetailsResponseDto } from '../../dto/GetE1DetailsResponseDto';

export interface IE1Repository {
  searchE1(request: SearchE1RequestDto): Promise<SearchE1ResponseDto>;
  getE1Details(request: GetE1DetailsRequestDto): Promise<GetE1DetailsResponseDto>;
} 