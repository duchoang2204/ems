// src/infrastructure/repositories/khaiThac/khaiThacVien/sanBayTra/WQuanLyHktvRepositoryOracle.ts

import { WQuanLyHktvRepository } from './WQuanLyHktvRepository';
import { getOracleConnection } from '../../../../../../config/database/db.config';

export class WQuanLyHktvRepositoryOracle implements WQuanLyHktvRepository {
  async checkIsXnd(params: {
    ngay: number;
    mabc_kt: number;
    mabc: number;
    chthu: number;
    tuiso: number;
  }): Promise<boolean> {
    const connection = await getOracleConnection();

    const sql = `
      SELECT isxnd
      FROM w_quanly_hktv
      WHERE ngay = :ngay AND mabc_kt = :mabc_kt AND mabc = :mabc AND chthu = :chthu AND tuiso = :tuiso
    `;

    const result = await connection.execute(sql, {
      ngay: params.ngay,
      mabc_kt: params.mabc_kt,
      mabc: params.mabc,
      chthu: params.chthu,
      tuiso: params.tuiso,
    });

    const row = result.rows?.[0];
    return row ? row[0] === 1 : false;
  }

  async updateIsXnd(params: {
    ngay: number;
    mabc_kt: number;
    mabc: number;
    chthu: number;
    tuiso: number;
    isxnd: number;
  }): Promise<void> {
    const connection = await getOracleConnection();

    const sql = `
      UPDATE w_quanly_hktv
      SET isxnd = :isxnd
      WHERE ngay = :ngay AND mabc_kt = :mabc_kt AND mabc = :mabc AND chthu = :chthu AND tuiso = :tuiso
    `;

    await connection.execute(sql, {
      isxnd: params.isxnd,
      ngay: params.ngay,
      mabc_kt: params.mabc_kt,
      mabc: params.mabc,
      chthu: params.chthu,
      tuiso: params.tuiso,
    }, { autoCommit: true });
  }
}
