// src/infrastructure/repositories/khaiThac/khaiThacVien/sanBayTra/E2Repository.ts

export interface E2Repository {
    taoE2(params: {
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
    }): Promise<void>;
  }
  