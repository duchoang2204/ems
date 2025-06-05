import { getConnection } from "../config/dbConfig";
import { normalizeDbKeysCamel } from "../utils/normalizeDbKeysCamel";
import { Shift } from "../types/shift.interface";

export async function getActiveShift(g_mabc: string): Promise<Shift | undefined> {
  const conn = await getConnection(g_mabc);
  const tableName = g_mabc === "100916" ? "ca_todong" : "ca_tomo";
  const result = await conn.execute(
    `SELECT * FROM ${tableName} WHERE active = 1 ORDER BY ngaybatdau DESC FETCH FIRST 1 ROWS ONLY`
  );
  await conn.close();
  const row = result.rows?.[0] ? normalizeDbKeysCamel<Shift>(result.rows[0]) : undefined;
  if (row && row.dateLog) row.dateLog = new Date(row.dateLog).toISOString();
  return row;
}
