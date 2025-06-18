import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/auth.repository.interface';
import { getConnectionByMaBC } from '../../../../config/database/db.config';
import { injectable } from 'tsyringe';
import oracledb from 'oracledb';

interface OracleUser {
  MANV: number;
  TENNV: string;
  MKHAU: string;
  MUCDO: number;
  KETOAN: number;
}

@injectable()
export class OracleUserRepository implements IUserRepository {
  async findByManv(g_mabc: string | number, manv: number, mkhau: string): Promise<User | null> {
    const g_mabc_str = g_mabc.toString();
    const g_mabc_num = Number(g_mabc);
    const conn = await getConnectionByMaBC(g_mabc_str);
    try {
      const result = await conn.execute(
        `BEGIN
          W_SP_AUTH_LOGIN(:p_g_mabc, :p_manv, :p_mkhau, :p_user, :p_error);
        END;`,
        {
          p_g_mabc: g_mabc_num,
          p_manv: manv,
          p_mkhau: mkhau,
          p_user: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          p_error: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
        }
      );

      const outBinds = result.outBinds as { [key: string]: any };
      if (outBinds.p_error) {
        throw new Error(outBinds.p_error);
      }

      const resultSet = outBinds.p_user as oracledb.ResultSet<any>;
      const row = await resultSet.getRow(); // Lấy đúng 1 dòng vì manv là key chính
      await resultSet.close();

      if (!row) {
        // Không có bản ghi nào trả về, đăng nhập sai
        return null;
      }

      // row là object với các key đúng như OracleUser
      const user = row as OracleUser;

      return User.create(
        user.MANV,
        user.TENNV,
        user.MKHAU,
        user.MUCDO,
        user.KETOAN,
        g_mabc_str
      );
    } finally {
      await conn.close();
    }
  }

  async findByUsername(g_mabc: string, username: string): Promise<User | null> {
    const conn = await getConnectionByMaBC(g_mabc);
    try {
      const result = await conn.execute(
        `SELECT manv, tennv, mkhau, mucdo, ketoan
         FROM nvien 
         WHERE tennv = :username`,
        { username }
      );

      if (!result.rows || result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0] as [number, string, string, number, number];
      return User.create(
        user[0], // manv
        user[1], // tennv
        user[2], // mkhau
        user[3], // mucdo
        user[4], // ketoan
        g_mabc
      );
    } finally {
      await conn.close();
    }
  }
} 