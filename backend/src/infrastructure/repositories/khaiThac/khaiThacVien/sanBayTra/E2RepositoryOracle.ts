// src/infrastructure/repositories/khaiThac/khaiThacVien/sanBayTra/E2RepositoryOracle.ts

import { E2Repository } from './E2Repository';


export class E2RepositoryOracle implements E2Repository {
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
    const connection = await getOracleConnection();

    // Tạm thời insert/update đơn giản → sau này bạn có thể xử lý giống TaoE2_den trong Access
    const sql = `
      MERGE INTO e2e2_ds e2
      USING dual
      ON (e2.ngay = :ngay AND e2.mabc_kt = :mabc_kt AND e2.mabc = :mabc AND e2.chthu = :chthu AND e2.tuiso = :tuiso)
      WHEN MATCHED THEN
        UPDATE SET
          manv = :manv,
          ngaykt = :ngaykt,
          cakt = :cakt,
          id_e2 = :id_e2,
          lastupdatetime = SYSDATE
      WHEN NOT MATCHED THEN
        INSERT (ngay, mabc_kt, mabc, chthu, tuiso, manv, ngaykt, cakt, id_e2, lastupdatetime)
        VALUES (:ngay, :mabc_kt, :mabc, :chthu, :tuiso, :manv, :ngaykt, :cakt, :id_e2, SYSDATE)
    `;

    await connection.execute(sql, {
      ngay: params.tui.ngay,
      mabc_kt: params.tui.mabc_kt,
      mabc: params.tui.mabc,
      chthu: params.tui.chthu,
      tuiso: params.tui.tuiso,
      manv: params.manv,
      ngaykt: params.ngaykt,
      cakt: params.cakt,
      id_e2: params.tui.id_e2,
    }, { autoCommit: true });
  }
}
function getOracleConnection() {
    throw new Error('Function not implemented.');
}

