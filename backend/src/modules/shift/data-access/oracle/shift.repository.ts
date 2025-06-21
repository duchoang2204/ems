import { injectable } from 'tsyringe';
import { IShiftRepository } from '../../domain/repositories/shift.repository.interface';
import { Shift } from '../../domain/entities/shift.entity';
import { getConnectionByMaBC } from '../../../../config/database/db.config';
import oracledb from 'oracledb';
import { logger } from '../../../../core/utils/logger.util';

interface OracleShift {
  NGAY: number;
  CA: number;
  TENCA: string;
  NGAYBATDAU: number;
  GIOBATDAU: number;
  NGAYKETTHUC: number;
  GIOKETTHUC: number;
  ACTIVE: number;
  ID_CA: number;
  NVXACNHAN_CA: string;
  MABC_KT: number;
  AUTO_XND: number;
  DATE_LOG: any;
}

@injectable()
export class OracleShiftRepository implements IShiftRepository {
  private getTableName(g_mabc: string): string {
    if (g_mabc === '100916') return 'ca_todong';
    if (g_mabc === '101000') return 'ca_tomo';
    throw new Error('Invalid g_mabc');
  }

  async findCurrentShift(g_mabc: string): Promise<Shift | null> {
    let conn;
    try {
      logger.info(`[SHIFT][Repo] findCurrentShift input: g_mabc=${g_mabc}`);
      conn = await getConnectionByMaBC(g_mabc);
      const result = await conn.execute(
        `BEGIN
          W_SP_SHIFT_CHECK_CURRENT(:p_g_mabc, :p_shift, :p_error);
        END;`,
        {
          p_g_mabc: Number(g_mabc),
          p_shift: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          p_error: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
        }
      );

      const outBinds = result.outBinds as { [key: string]: any };
      if (outBinds.p_error) {
        logger.error(`[SHIFT][Repo] Lỗi từ SP: ${outBinds.p_error}`);
        if (outBinds.p_error === 'INVALID_G_MABC') {
          throw new Error('INVALID_G_MABC');
        }
        if (outBinds.p_error === 'NO_SHIFT_FOUND') {
          throw new Error('NO_SHIFT_FOUND');
        }
        throw new Error('SHIFT_SYSTEM_ERROR');
      }

      const resultSet = outBinds.p_shift as oracledb.ResultSet<any>;
      const row = await resultSet.getRow();
      await resultSet.close();

      if (!row) {
        logger.error('[SHIFT][Repo] Không có ca trực nào được trả về từ SP');
        throw new Error('NO_SHIFT_FOUND');
      }

      const shift = row as OracleShift;
      return new Shift(
        shift.NGAY,
        shift.CA,
        shift.TENCA,
        shift.NGAYBATDAU,
        shift.GIOBATDAU,
        shift.NGAYKETTHUC,
        shift.GIOKETTHUC,
        shift.ACTIVE,
        shift.NVXACNHAN_CA,
        shift.MABC_KT,
        shift.AUTO_XND,
        shift.DATE_LOG,
        shift.ID_CA
      );
    } catch (err: any) {
      logger.error(`[SHIFT][Repo] Lỗi khi gọi SP check ca: ${err.message}`);
      throw err;
    } finally {
      if (conn) await conn.close();
    }
  }

  async findById(g_mabc: string, idCa: number): Promise<Shift | null> {
    const conn = await getConnectionByMaBC(g_mabc);
    try {
      const result = await conn.execute<{
        p_shift: OracleShift[];
        p_error: string;
        p_g_mabc: number;
        p_id_ca: number;
      }>(
        `BEGIN
          W_SP_SHIFT_FIND_BY_ID(:p_g_mabc, :p_id_ca, :p_shift, :p_error);
        END;`,
        {
          p_g_mabc: Number(g_mabc),
          p_id_ca: idCa,
          p_shift: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          p_error: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
        }
      );

      if (result.outBinds?.p_error) {
        throw new Error(result.outBinds.p_error);
      }

      if (!result.outBinds?.p_shift) {
        return null;
      }

      const shift = result.outBinds.p_shift[0];
      if (!shift) {
        return null;
      }

      return Shift.create({
        ngay: shift.NGAY,
        ca: shift.CA,
        tenca: shift.TENCA,
        ngayBatDau: shift.NGAYBATDAU,
        gioBatDau: shift.GIOBATDAU,
        ngayKetThuc: shift.NGAYKETTHUC,
        gioKetThuc: shift.GIOKETTHUC,
        active: shift.ACTIVE,
        nvXacNhanCa: shift.NVXACNHAN_CA,
        mabcKt: shift.MABC_KT,
        autoXnd: shift.AUTO_XND
      });
    } finally {
      await conn.close();
    }
  }

  async findActiveShift(g_mabc: string): Promise<Shift | null> {
    const conn = await getConnectionByMaBC(g_mabc);
    try {
      const result = await conn.execute<{
        p_shift: OracleShift[];
        p_error: string;
        p_g_mabc: number;
      }>(
        `BEGIN
          W_SP_SHIFT_FIND_ACTIVE(:p_g_mabc, :p_shift, :p_error);
        END;`,
        {
          p_g_mabc: Number(g_mabc),
          p_shift: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          p_error: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
        }
      );

      if (result.outBinds?.p_error) {
        throw new Error(result.outBinds.p_error);
      }

      if (!result.outBinds?.p_shift) {
        return null;
      }

      const shift = result.outBinds.p_shift[0];
      if (!shift) {
        return null;
      }

      return Shift.create({
        ngay: shift.NGAY,
        ca: shift.CA,
        tenca: shift.TENCA,
        ngayBatDau: shift.NGAYBATDAU,
        gioBatDau: shift.GIOBATDAU,
        ngayKetThuc: shift.NGAYKETTHUC,
        gioKetThuc: shift.GIOKETTHUC,
        active: shift.ACTIVE,
        nvXacNhanCa: shift.NVXACNHAN_CA,
        mabcKt: shift.MABC_KT,
        autoXnd: shift.AUTO_XND
      });
    } finally {
      await conn.close();
    }
  }
} 