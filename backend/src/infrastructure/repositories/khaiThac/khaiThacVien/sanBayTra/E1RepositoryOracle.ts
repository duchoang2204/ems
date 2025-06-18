// src/infrastructure/repositories/khaiThac/khaiThacVien/sanBayTra/E1RepositoryOracle.ts

import { E1Repository } from './E1Repository';
import { getOracleConnection } from '../../../../../../config/database/db.config';

export class E1RepositoryOracle implements E1Repository {
  async insertE1(params: {
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
  }): Promise<void> {
    const connection = await getOracleConnection();

    // Giả sử bạn có logic chọn e1i2 hay e1e2_hktv theo mabc_kt, mabc → xử lý ở đây
    const sourceTable = params.tui.mabc_kt === 138700 ? 'e1i2' : 'e1e2_hktv';

    const sql = `
      INSERT INTO e1e2_ds (mae1, chthu, tuiso, ngay, gio, manv, mabc_kt, ngaykt, cakt, id_e2, lanlap)
      SELECT
        mae1, :chthu, :tuiso, :ngay, TO_NUMBER(TO_CHAR(SYSDATE, 'HH24MI')), :manv, :mabc_kt, :ngaykt, :cakt, :id_e2, :lanlap
      FROM ${sourceTable}
      WHERE mabc_kt = :mabc_kt AND mabc = :mabc AND chthu = :chthu AND tuiso = :tuiso
    `;

    await connection.execute(sql, {
      chthu: params.tui.chthu,
      tuiso: params.tui.tuiso,
      ngay: params.tui.ngay,
      manv: params.manv,
      mabc_kt: params.tui.mabc_kt,
      ngaykt: params.ngaykt,
      cakt: params.cakt,
      id_e2: params.tui.id_e2,
      lanlap: params.lanlap,
      mabc: params.tui.mabc,
    }, { autoCommit: true });
  }
}
