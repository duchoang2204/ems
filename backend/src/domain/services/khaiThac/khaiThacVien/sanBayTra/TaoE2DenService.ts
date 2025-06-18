// src/domain/services/khaiThac/khaiThacVien/sanBayTra/TaoE2DenService.ts

import { E2Repository } from "../../../../../infrastructure/repositories/khaiThac/khaiThacVien/sanBayTra/E2Repository";

export class TaoE2DenService {
  constructor(private readonly e2Repository: E2Repository) {}

  async taoE2(params: {
    ngaykt: number;
    cakt: number;
    manv: number;
    tui: {
      mabc_kt: number;
      mabc: number;
      ngay: number;
      chthu: number;
      tuiso: number;
      id_e2: string;
    };
  }): Promise<void> {
    // Tạm thời gọi E2Repository.taoE2
    // Bạn có thể mở rộng thêm logic tính TONGSO, KHOILUONG, CUOCCS, CUOCDV nếu cần (giống Access)

    await this.e2Repository.taoE2({
      ngaykt: params.ngaykt,
      cakt: params.cakt,
      manv: params.manv,
      tui: {
        mabc_kt: params.tui.mabc_kt,
        mabc: params.tui.mabc,
        ngay: params.tui.ngay,
        chthu: params.tui.chthu,
        tuiso: params.tui.tuiso,
        id_e2: params.tui.id_e2,
      },
    });
  }
}
