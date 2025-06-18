import { Router } from 'express';
import { container } from 'tsyringe';
import { E1Controller } from '../../interfaces/controllers/van-chuyen/E1Controller';

const router = Router();
const e1Controller = container.resolve(E1Controller);

router.get('/search', (req, res) => e1Controller.searchE1(req, res));
router.get('/details', (req, res) => e1Controller.getE1Details(req, res));

export default router; 