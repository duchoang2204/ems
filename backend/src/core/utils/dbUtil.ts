import oracledb from 'oracledb';
import { dbConfigHNLT, dbConfigHNNT, dbConfigHCMLT } from '../config/database/db.config';

/**
 * Lấy connection theo tên database
 * @param dbName Tên database (HNLT, HNNT, HCMLT)
 * @returns Oracle connection
 * @throws Error nếu tên database không hợp lệ
 */
export const getDbConnection = async (dbName: string) => {
  switch (dbName) {
    case 'HNLT':
      return await oracledb.getConnection(dbConfigHNLT);
    case 'HNNT':
      return await oracledb.getConnection(dbConfigHNNT);
    case 'HCMLT':
      return await oracledb.getConnection(dbConfigHCMLT);
    default:
      throw new Error(`Unknown DB config: ${dbName}`);
  }
}; 