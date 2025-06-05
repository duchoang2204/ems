import { Request, Response } from "express";
import * as shiftService from "../services/shift.service";

// Lấy thông tin ca hiện tại (có thể dùng cho dashboard, quản trị...)
export async function getCurrentShift(req: Request, res: Response) {
  const g_mabc = req.body.g_mabc || req.query.g_mabc;
  try {
    const shift = await shiftService.getCurrentShift(g_mabc);
    if (!shift) return res.status(404).json({ msg: "Không có ca đang hoạt động!" });
    res.json(shift);
  } catch (e: any) {
    res.status(500).json({ msg: e.message });
  }
}

// Kiểm tra ca hợp lệ (dùng cho đăng nhập và mọi nơi cần check ca)
export async function checkCurrentShift(req: Request, res: Response) {
  const { g_mabc } = req.body;
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyymmdd = Number(`${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}`);
  const hhmm = Number(`${pad(now.getHours())}${pad(now.getMinutes())}`);

  try {
    const result = await shiftService.checkShiftValid(g_mabc, yyyymmdd, hhmm);
    if (result.ok) res.json({ ok: true, shift: result.shift });
    else res.json({ ok: false, msg: result.msg });
  } catch (e: any) {
    res.status(500).json({ ok: false, msg: e.message });
  }
}
