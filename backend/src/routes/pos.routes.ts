import { Router } from 'express';
import { container } from 'tsyringe';
import { PosController } from '../interfaces/controllers/pos/PosController';

const posRouter = Router();
const posController = container.resolve(PosController);

posRouter.post('/get-names', posController.getNames.bind(posController));

export default posRouter; 