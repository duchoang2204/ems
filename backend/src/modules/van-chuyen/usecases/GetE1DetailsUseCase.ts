import { injectable, inject } from 'tsyringe';
import { IE1Repository } from '../domain/repositories/IE1Repository';
import { GetE1DetailsRequestDto } from '../dto/GetE1DetailsRequestDto';
import { GetE1DetailsResponseDto } from '../dto/GetE1DetailsResponseDto';
import { VAN_CHUYEN_TOKENS } from '../di/tokens';

@injectable()
export class GetE1DetailsUseCase {
  constructor(
    @inject(VAN_CHUYEN_TOKENS.E1Repository) private e1Repository: IE1Repository
  ) {}

  async execute(request: GetE1DetailsRequestDto): Promise<GetE1DetailsResponseDto> {
    return this.e1Repository.getE1Details(request);
  }
} 