import { getConnection } from "../config/dbConfig";
import { normalizeDbKeysCamel } from "../utils/normalizeDbKeysCamel";

export interface User {
  manv: number;
  tennv: string;
  mkhau: string;
  mucdo: number;
  // ... thêm trường nếu có
}

export async function findUserByManv(g_mabc: string, manv: number): Promise<User | undefined> {
  const conn = await getConnection(g_mabc);
  const result = await conn.execute(
    "SELECT MANV, TENNV, MKHAU, MUCDO FROM NVIEN WHERE MANV = :manv",
    { manv },
    { outFormat: 4002 }
  );
  await conn.close();
  return result.rows?.[0] ? normalizeDbKeysCamel<User>(result.rows[0]) : undefined;
}
