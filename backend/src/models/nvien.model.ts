import { getConnection } from "../config/dbConfig";
import { normalizeDbKeysCamel } from "../utils/normalizeDbKeysCamel";

export interface User {
  manv: number;
  tennv: string;
  mkhau: string;
  mucdo: number;
  [key: string]: any;
}

export async function findUserByManv(g_mabc: string, manv: number): Promise<User | undefined> {
  const conn = await getConnection(g_mabc);
  const result = await conn.execute(
    "SELECT MANV, TENNV, MKHAU, MUCDO FROM NVIEN WHERE MANV = :manv",
    { manv },
    { outFormat: 4002 } // hoặc: oracledb.OUT_FORMAT_OBJECT
  );
  await conn.close();
  // Chuẩn hóa sang camelCase
  return result.rows?.[0] ? normalizeDbKeysCamel<User>(result.rows[0]) : undefined;
}
