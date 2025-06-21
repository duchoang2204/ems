import oracledb, { ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";
dotenv.config();

// Cấu hình Oracle Client
try {
  oracledb.initOracleClient({ libDir: "C:\\oracle\\instantclient_19_26" });
} catch (err) {
  console.log("Oracle Client đã được khởi tạo");
}

// Cấu hình connection pool
oracledb.autoCommit = true;
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Cấu hình kết nối cho từng database
export const dbConfigHNLT: ConnectionAttributes = {
  user: process.env.DB_HNLT_USER,
  password: process.env.DB_HNLT_PASSWORD,
  connectString: process.env.DB_HNLT_CONNECT_STRING,
};

export const dbConfigHNNT: ConnectionAttributes = {
  user: process.env.DB_HNNT_USER,
  password: process.env.DB_HNNT_PASSWORD,
  connectString: process.env.DB_HNNT_CONNECT_STRING,
};

export const dbConfigHCMLT: ConnectionAttributes = {
  user: process.env.DB_HCMLT_USER,
  password: process.env.DB_HCMLT_PASSWORD,
  connectString: process.env.DB_HCMLT_CONNECT_STRING,
};

// Map mã bưu cục với config tương ứng
const dbConfigMap: { [key: string]: ConnectionAttributes } = {
  "100916": dbConfigHNLT,  // HNLT
  "101000": dbConfigHNNT,  // HNNT
  "700916": dbConfigHCMLT, // HCMLT
};

/**
 * Lấy connection theo mã bưu cục từ pool
 * @param mabc Mã bưu cục
 * @returns Oracle connection
 * @throws Error nếu mã bưu cục không hợp lệ hoặc pool chưa khởi tạo
 */
export async function getConnectionByMaBC(mabc: string) {
  let poolAlias = '';
  switch (mabc) {
    case '100916': poolAlias = 'HNLT'; break;
    case '101000': poolAlias = 'HNNT'; break;
    case '700916': poolAlias = 'HCMLT'; break;
    default: throw new Error('Mã bưu cục không hợp lệ!');
  }
  try {
    return await oracledb.getConnection(poolAlias);
  } catch (err: any) {
    console.error('Lỗi lấy connection từ pool:', err.message);
    throw new Error('Không thể lấy connection từ pool!');
  }
} 