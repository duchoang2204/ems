import '../di/container';
import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = container.resolve(AuthController);

// Auth routes
router.post('/login', (req, res) => authController.login(req, res));

export default router; 