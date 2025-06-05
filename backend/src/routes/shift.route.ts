import { Router } from "express";
import * as shiftController from "../controllers/shift.controller";
const router = Router();

router.post("/check", shiftController.checkCurrentShift);

export default router;
