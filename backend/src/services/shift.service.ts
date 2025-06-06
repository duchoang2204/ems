
import { getActiveShift } from "../models/shift.model";
import { Shift } from "../types/shift.interface";

export interface CheckShiftResult {
  ok: boolean;
  msg?: string;
  shift?: Shift;
}

export async function checkShiftValid(
  g_mabc: string,
  yyyymmdd: number,
  hhmm: number
): Promise<CheckShiftResult> {
  const shift = await getActiveShift(g_mabc);
  if (!shift) {
    return { ok: false, msg: "Ca hiện tại chưa được thiết lập!" };
  }

  const {
    gioBatDau,
    ngayBatDau,
    gioKetThuc,
    ngayKetThuc,
    active
  } = shift;

  if (active !== 1) {
    return { ok: false, msg: "Ca hiện tại chưa active!" };
  }

  if (yyyymmdd < ngayBatDau || yyyymmdd > ngayKetThuc) {
    return { ok: false, msg: "Ngoài ngày làm việc của ca!" };
  }

  if (
    (yyyymmdd === ngayBatDau && hhmm < gioBatDau) ||
    (yyyymmdd === ngayKetThuc && hhmm >= gioKetThuc)
  ) {
    return {
      ok: false,
      msg: "Giờ làm việc của ca hiện tại đã hết hoặc chưa tới!"
    };
  }

  return { ok: true, shift };
}
