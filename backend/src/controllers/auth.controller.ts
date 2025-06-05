import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function login(req: Request, res: Response) {
  try {
    const { g_mabc, manv, mkhau } = req.body;
    if (!g_mabc || !manv || !mkhau) return res.status(400).json({ msg: "Thiếu thông tin" });
    const result = await authService.login(g_mabc, Number(manv), mkhau);
    res.json(result);
  } catch (e: any) {
    res.status(401).json({ msg: e.message });
  }
}
