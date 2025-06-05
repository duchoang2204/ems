import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function loginController(req: Request, res: Response) {
  try {
    const { g_mabc, manv, mkhau } = req.body;
    const result = await authService.login(g_mabc, manv, mkhau);
    res.json({ ok: true, ...result });
  } catch (err: any) {
    res.status(401).json({ ok: false, code: err.code, msg: err.msg });
  }
}
