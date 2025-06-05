import { findUserByManv } from "../models/nvien.model";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt";
import { User } from "../types/nvien.interface";

export interface AuthResponse {
  token: string;
  user: Pick<User, "manv" | "tennv" | "mucdo" | "ketoan">;
}

export async function login(g_mabc: string, manv: number, mkhau: string): Promise<AuthResponse> {
  const user = await findUserByManv(g_mabc, manv);
  if (!user) throw { code: "USER_NOT_FOUND", msg: "Mã nhân viên không tồn tại!" };
  if (user.mkhau !== mkhau) throw { code: "WRONG_PASSWORD", msg: "Mật khẩu không chính xác!" };
  const token = jwt.sign({ manv: user.manv, mucdo: user.mucdo, ketoan: user.ketoan, g_mabc }, JWT_SECRET, { expiresIn: "12h" });
  return { token, user: { manv: user.manv, tennv: user.tennv, mucdo: user.mucdo, ketoan: user.ketoan } };
}
