import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function loginController(req: Request, res: Response) {
  try {
    const { g_mabc, manv, mkhau } = req.body;
    const result = await authService.login(g_mabc, manv, mkhau);
    res.json(result);
  } catch (err: any) {
    if (err.code === "USER_NOT_FOUND")
      return res.status(401).json({ code: "USER_NOT_FOUND", msg: err.message });
    if (err.code === "WRONG_PASSWORD")
      return res.status(401).json({ code: "WRONG_PASSWORD", msg: err.message });
    res.status(500).json({ code: "INTERNAL_ERROR", msg: "Đã xảy ra lỗi hệ thống." });
  }
}
