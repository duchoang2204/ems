import { container } from 'tsyringe';
import { SHIFT_TOKENS } from './tokens';
import { CheckCurrentShiftUseCase } from '../usecases/check-current-shift.usecase';
import { ShiftService } from '../services/shift.service';
import { OracleShiftRepository } from '../data-access/oracle/shift.repository';

// Đăng ký các dependency cho shift module
container.registerSingleton(SHIFT_TOKENS.CheckCurrentShiftUseCase, CheckCurrentShiftUseCase);
container.registerSingleton(SHIFT_TOKENS.ShiftService, ShiftService);
container.registerSingleton(SHIFT_TOKENS.ShiftRepository, OracleShiftRepository); 