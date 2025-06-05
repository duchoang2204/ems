import { Router } from "express";
import * as shiftController from "../controllers/shift.controller";
const router = Router();

// Lấy thông tin ca hiện tại
router.get("/current", shiftController.getCurrentShift);

// Kiểm tra ca hợp lệ (API dùng cho frontend)
router.post("/check", shiftController.checkCurrentShift);

export default router;
