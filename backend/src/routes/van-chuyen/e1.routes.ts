import { Router } from 'express';
import { container } from 'tsyringe';
import { E1Controller } from '../../interfaces/controllers/van-chuyen/E1Controller';

const router = Router();
const e1Controller = container.resolve(E1Controller);

router.post('/search', (req, res, next) => e1Controller.searchE1(req, res, next));
router.post('/details', (req, res, next) => e1Controller.getE1Details(req, res, next));

export default router; 