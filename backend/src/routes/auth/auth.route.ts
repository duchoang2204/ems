import { Router } from "express";
import { AuthController } from "../../interfaces/controllers/auth/AuthController";
import { container } from "tsyringe";

const router = Router();
const authController = container.resolve(AuthController);

router.post("/login", (req, res) => authController.login(req, res));

export default router; 