import { container } from 'tsyringe';
import { PosRepository } from '../data-access/pos.repository';
import { IPosRepository } from '../domain/repositories/pos.repository.interface';
import { PosService } from '../services/pos.service';

// Đăng ký các dependency của module POS
container.register(IPosRepository, { useClass: PosRepository });
container.register(PosService, { useClass: PosService });