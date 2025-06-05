import { Request, Response } from "express";
import * as shiftService from "../services/shift.service";

export async function checkCurrentShift(req: Request, res: Response) {
  try {
    const { g_mabc } = req.body;
    // Lấy ngày giờ hiện tại (giờ Hà Nội nếu cần chỉnh timezone)
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const yyyymmdd = Number(
      `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
    );
    const hhmm = Number(`${pad(now.getHours())}${pad(now.getMinutes())}`);

    const result = await shiftService.checkShiftValid(g_mabc, yyyymmdd, hhmm);
    if (result.ok) {
      return res.json({ ok: true, shift: result.shift });
    }
    res.json({ ok: false, msg: result.msg });
  } catch (err: any) {
    res.status(500).json({ ok: false, msg: "Đã xảy ra lỗi kiểm tra ca." });
  }
}
