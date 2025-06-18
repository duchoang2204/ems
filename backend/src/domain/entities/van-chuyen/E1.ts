export class E1 {
  constructor(
    public mae1: string,
    public ngay: string,
    public mabcDong: string,
    public mabcNhan: string,
    public chthu: string,
    public tuiso: string,
    public khoiluong: string
  ) {}

  static create(
    mae1: string,
    ngay: string,
    mabcDong: string,
    mabcNhan: string,
    chthu: string,
    tuiso: string,
    khoiluong: string
  ): E1 {
    return new E1(mae1, ngay, mabcDong, mabcNhan, chthu, tuiso, khoiluong);
  }
} 