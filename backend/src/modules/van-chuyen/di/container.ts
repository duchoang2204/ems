import { container } from 'tsyringe';
import { VanChuyenRepositoryOracle } from '../../../infrastructure/repositories/van-chuyen/VanChuyenRepositoryOracle';
import { IE1Repository } from '../../../domain/repositories/van-chuyen/IE1Repository';

// Đăng ký repository cho van-chuyen
container.registerSingleton<IE1Repository>('E1Repository', VanChuyenRepositoryOracle); 