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
  // Ca ngày bình thường
  if (
    (gioBatDau < gioKetThuc && hhmm >= gioBatDau && hhmm < gioKetThuc) ||
    // Ca đêm: giờ bắt đầu > giờ kết thúc (qua ngày mới)
    (gioBatDau > gioKetThuc && (hhmm >= gioBatDau || hhmm < gioKetThuc))
  ) {
    return { ok: true, shift };
  }
  return {
    ok: false,
    msg: "Giờ làm việc của ca hiện tại đã hết, yêu cầu nới rộng thời gian làm việc hoặc tạo ca mới!"
  };
}
