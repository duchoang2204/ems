export class Shift {
  constructor(
    public ngay: number,
    public ca: number,
    public tenca: string,
    public ngayBatDau: number,
    public gioBatDau: number,
    public ngayKetThuc: number,
    public gioKetThuc: number,
    public active: number,
    public nvXacNhanCa: string,
    public mabcKt: number,
    public autoXnd: number,
    public dateLog?: string,
    public idCa?: number
  ) {}

  static create(data: Partial<Shift>): Shift {
    return new Shift(
      data.ngay!,
      data.ca!,
      data.tenca!,
      data.ngayBatDau!,
      data.gioBatDau!,
      data.ngayKetThuc!,
      data.gioKetThuc!,
      data.active!,
      data.nvXacNhanCa!,
      data.mabcKt!,
      data.autoXnd!,
      data.dateLog,
      data.idCa
    );
  }

  isActive(now: Date): boolean {
    // Logic kiểm tra ca đang active dựa trên ngày/giờ hiện tại
    if (this.active !== 1) return false;
    // Chuyển đổi giờ/ngày bắt đầu/kết thúc về Date
    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      Math.floor(this.gioBatDau / 100),
      this.gioBatDau % 100
    );
    const end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      Math.floor(this.gioKetThuc / 100),
      this.gioKetThuc % 100
    );
    return now >= start && now <= end;
  }
} 