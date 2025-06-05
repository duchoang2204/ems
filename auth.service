import { findUserByManv, User } from "../models/nvien.model";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt";

interface AuthResponse {
  token: string;
  user: {
    manv: number;
    tennv: string;
    mucdo: number;
  };
}
export async function login(g_mabc: string, manv: number, mkhau: string): Promise<AuthResponse> {
  console.log(`[LOGIN] Đang kiểm tra đăng nhập - MANV: ${manv}, G_MABC: ${g_mabc}`);
  
  // Kiểm tra tài khoản
  const user = await findUserByManv(g_mabc, manv);
  if (!user) {
    console.log(`[LOGIN] ❌ Không tìm thấy nhân viên ${manv}`);
    throw new Error("Tài khoản không tồn tại trong hệ thống!");
  }
  
  // Kiểm tra mật khẩu
  if (user.MKHAU !== mkhau) {
    console.log(`[LOGIN] ❌ Sai mật khẩu - MANV: ${manv}`);
    throw new Error("Mật khẩu không chính xác!");
  }

   // Tạo token và trả về thông tin
   const token = jwt.sign(
    { manv: user.MANV, mucdo: user.MUCDO, g_mabc },
    JWT_SECRET,
    { expiresIn: "12h" }
  );
  
  console.log(`[LOGIN] ✅ Đăng nhập thành công - MANV: ${manv}, Tên: ${user.TENNV}, Mức độ: ${user.MUCDO}`);

  return { 
    token, 
    user: { 
      manv: user.MANV, 
      tennv: user.TENNV, 
      mucdo: user.MUCDO 
    } 
  };
}
