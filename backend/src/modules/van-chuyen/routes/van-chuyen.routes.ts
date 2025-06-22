import { Router } from 'express';
import { container } from 'tsyringe';
import '../di/container'; // Đảm bảo DI container được load
import { E1Controller } from '../controllers/e1.controller';
import { VAN_CHUYEN_TOKENS } from '../di/tokens';

const router = Router();

// Đăng ký controller trong container
container.register(VAN_CHUYEN_TOKENS.E1Controller, {
  useClass: E1Controller
});

const e1Controller = container.resolve<E1Controller>(VAN_CHUYEN_TOKENS.E1Controller);

// E1 routes
router.post('/e1/search', (req, res, next) => e1Controller.searchE1(req, res, next));
router.post('/e1/details', (req, res, next) => e1Controller.getE1Details(req, res, next));

export default router; 