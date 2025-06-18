// src/infrastructure/repositories/khaiThac/khaiThacVien/sanBayTra/E1Repository.ts

export interface E1Repository {
    insertE1(params: {
      lanlap: number;
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
        ischon: number;
      };
    }): Promise<void>;
  }
  