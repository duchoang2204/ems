import { injectable, inject } from 'tsyringe';
import { IE1Repository } from '../../../domain/repositories/van-chuyen/IE1Repository';
import { GetE1DetailsRequestDto } from '../../dto/van-chuyen/GetE1DetailsRequestDto';
import { GetE1DetailsResponseDto } from '../../dto/van-chuyen/GetE1DetailsResponseDto';

@injectable()
export class GetE1DetailsUseCase {
  constructor(
    @inject('E1Repository') private e1Repository: IE1Repository
  ) {}

  async execute(request: GetE1DetailsRequestDto): Promise<GetE1DetailsResponseDto> {
    return this.e1Repository.getE1Details(request);
  }
} 