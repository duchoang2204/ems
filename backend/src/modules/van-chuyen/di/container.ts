import { container } from 'tsyringe';
import { VAN_CHUYEN_TOKENS } from './tokens';
import { IE1Repository } from '../domain/repositories/IE1Repository';
import { VanChuyenRepositoryOracle } from '../data-access/van-chuyen.repository';
import { SearchE1UseCase } from '../usecases/SearchE1UseCase';
import { GetE1DetailsUseCase } from '../usecases/GetE1DetailsUseCase';

// Đăng ký repository
container.register<IE1Repository>(VAN_CHUYEN_TOKENS.E1Repository, {
  useClass: VanChuyenRepositoryOracle,
});

// Đăng ký use cases
container.register(VAN_CHUYEN_TOKENS.SearchE1UseCase, {
  useClass: SearchE1UseCase
});

container.register(VAN_CHUYEN_TOKENS.GetE1DetailsUseCase, {
  useClass: GetE1DetailsUseCase
}); 