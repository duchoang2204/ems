// src/domain/services/khaiThac/khaiThacVien/sanBayTra/SanBayTraDomainService.ts

import { E1Repository } from "../../../../../infrastructure/repositories/khaiThac/khaiThacVien/sanBayTra/E1Repository";
import { E2Repository } from "../../../../../infrastructure/repositories/khaiThac/khaiThacVien/sanBayTra/E2Repository";
import { WQuanLyHktvRepository } from "../../../../../infrastructure/repositories/khaiThac/khaiThacVien/sanBayTra/WQuanLyHktvRepository";
import { TaoE2DenService } from "./TaoE2DenService";



export class SanBayTraDomainService {
  constructor(
    private readonly e1Repository: E1Repository,
    private readonly e2Repository: E2Repository,
    private readonly wQuanLyHktvRepository: WQuanLyHktvRepository,
    private readonly taoE2DenService: TaoE2DenService
  ) {}

  async xacNhanDen({
    lanlap,
    ngaykt,
    cakt,
    manv,
    listTuiKien,
  }: {
    lanlap: number;
    ngaykt: number;
    cakt: number;
    manv: number;
    listTuiKien: Array<{
      mabc_kt: number;
      mabc: number;
      ngay: number;
      chthu: number;
      tuiso: number;
      id_e2: string;
      ischon: number;
    }>;
  }): Promise<void> {
    for (const tui of listTuiKien) {
      const isXnd = await this.wQuanLyHktvRepository.checkIsXnd({
        ngay: tui.ngay,
        mabc_kt: tui.mabc_kt,
        mabc: tui.mabc,
        chthu: tui.chthu,
        tuiso: tui.tuiso,
      });

      if (isXnd) {
        continue; // Skip nếu đã XND
      }

      // Insert E1 → e1e2_ds or e1e2_hktv
      await this.e1Repository.insertE1({
        lanlap,
        ngaykt,
        cakt,
        manv,
        tui,
      });

      // Update WQuanLyHktv → isxnd = 1
      await this.wQuanLyHktvRepository.updateIsXnd({
        ngay: tui.ngay,
        mabc_kt: tui.mabc_kt,
        mabc: tui.mabc,
        chthu: tui.chthu,
        tuiso: tui.tuiso,
        isxnd: 1,
      });

      // Update/Insert E2
      await this.taoE2DenService.taoE2({
        ngaykt,
        cakt,
        manv,
        tui,
      });
    }
  }
}
