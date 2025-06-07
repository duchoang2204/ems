import { getConnectionByMaBC } from "../config/db.config";
import { normalizeDbKeysCamel } from "../utils/normalizeDbKeysCamel";
import { User } from "../types/nvien.interface";

export async function findUserByManv(g_mabc: string, manv: number): Promise<User | undefined> {
  const conn = await getConnectionByMaBC(g_mabc);
  const result = await conn.execute(
    "SELECT MANV, TENNV, MKHAU, MUCDO, KETOAN FROM NVIEN WHERE MANV = :manv",
    { manv },
    { outFormat: 4002 }
  );
  console.log("🔍 DB result.rows:", result.rows); // Thêm log để xem có trả rows hay không
  await conn.close();
  return result.rows?.[0] ? normalizeDbKeysCamel<User>(result.rows[0]) : undefined;
}
