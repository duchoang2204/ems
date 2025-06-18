// src/application/services/khaiThac/khaiThacVien/sanBayTra/SanBayTraService.ts

import { SanBayTraDomainService } from "../../../../../domain/services/khaiThac/khaiThacVien/sanBayTra/SanBayTraDomainService";

export class SanBayTraService {
  constructor(private readonly sanBayTraDomainService: SanBayTraDomainService) {}

  async xacNhanDen(input: {
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
    await this.sanBayTraDomainService.xacNhanDen(input);
  }
}
