// src/infrastructure/repositories/khaiThac/khaiThacVien/sanBayTra/WQuanLyHktvRepository.ts

export interface WQuanLyHktvRepository {
    checkIsXnd(params: {
      ngay: number;
      mabc_kt: number;
      mabc: number;
      chthu: number;
      tuiso: number;
    }): Promise<boolean>;
  
    updateIsXnd(params: {
      ngay: number;
      mabc_kt: number;
      mabc: number;
      chthu: number;
      tuiso: number;
      isxnd: number;
    }): Promise<void>;
  }
  