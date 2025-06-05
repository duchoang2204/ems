import { findUserByManv, User } from "../models/nvien.model";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt";

export interface AuthResponse {
  token: string;
  user: {
    manv: number;
    tennv: string;
    mucdo: number;
  };
}

export async function login(g_mabc: string, manv: number, mkhau: string): Promise<AuthResponse> {
  const user = await findUserByManv(g_mabc, manv);
  if (!user) {
    const error: any = new Error("Mã nhân viên không tồn tại!");
    error.code = "USER_NOT_FOUND";
    throw error;
  }
  if (user.mkhau !== mkhau) {
    const error: any = new Error("Mật khẩu không chính xác!");
    error.code = "WRONG_PASSWORD";
    throw error;
  }
  const token = jwt.sign(
    { manv: user.manv, mucdo: user.mucdo, g_mabc },
    JWT_SECRET,
    { expiresIn: "12h" }
  );
  return {
    token,
    user: { manv: user.manv, tennv: user.tennv, mucdo: user.mucdo }
  };
}
