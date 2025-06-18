import { Router } from "express";
import { container } from "tsyringe";
import { ShiftController } from "../../interfaces/controllers/shift/ShiftController";

const router = Router();
const shiftController = container.resolve(ShiftController);

router.post("/check-current", (req, res) => shiftController.checkCurrentShift(req, res));

export default router; 