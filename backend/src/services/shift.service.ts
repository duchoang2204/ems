import { getConnection } from "../config/dbConfig";
import { normalizeDbKeysCamel } from "../utils/normalizeDbKeysCamel";

export async function getCurrentShift(g_mabc: string) {
  const conn = await getConnection(g_mabc);
  const tableName = g_mabc === "100916" ? "ca_todong" : "ca_tomo";
  const result = await conn.execute(
    `SELECT * FROM ${tableName} WHERE active = 1 ORDER BY ngaybatdau DESC FETCH FIRST 1 ROWS ONLY`
  );
  await conn.close();
  // return result.rows?.[0];
  // Chuẩn hóa keys về thường ngay sau khi lấy ra
  return result.rows?.[0] ? normalizeDbKeysCamel(result.rows[0]) : undefined;
}

interface ShiftData {
  giobatdau: number;
  ngaybatdau: number;
  gioketthuc: number;
  ngayketthuc: number;
  active: number;
  [key: string]: any;
}

export async function checkShiftValid(
  g_mabc: string,
  yyyymmdd: number,
  hhmm: number
) {
  const shift = await getCurrentShift(g_mabc) as ShiftData | undefined;
  if (!shift) {
    return { ok: false, msg: "Ca hiện tại chưa được khởi tạo!" };
  }
  const { giobatdau, ngaybatdau, gioketthuc, ngayketthuc, active } = shift;
  if (active !== 1) {
    return { ok: false, msg: "Ca hiện tại chưa active!" };
  }
  if (yyyymmdd < ngaybatdau || yyyymmdd > ngayketthuc) {
    return { ok: false, msg: "Ngoài ngày làm việc của ca!" };
  }
  // Ca ngày bình thường
  if (
    (giobatdau < gioketthuc && hhmm >= giobatdau && hhmm < gioketthuc) ||
    // Ca đêm: giờ bắt đầu > giờ kết thúc (qua ngày mới)
    (giobatdau > gioketthuc && (hhmm >= giobatdau || hhmm < gioketthuc))
  ) {
    return { ok: true, shift };
  }
  return { ok: false, msg: "Ngoài giờ làm việc của ca hiện tại!" };
}
