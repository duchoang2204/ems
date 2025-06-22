import '../di/container';
import { Router } from 'express';
import { container } from 'tsyringe';
import { PosController } from '../controllers/pos.controller';

const posRouter = Router();
// Resolve controller sau khi đã đăng ký dependency
const posController = container.resolve(PosController);

posRouter.get('/:posCode', posController.getName.bind(posController));

export { posRouter }; 