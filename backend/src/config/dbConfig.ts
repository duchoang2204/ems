import oracledb from "oracledb";
import dotenv from "dotenv";
import path from "path";
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

type DbConfig = {
  user: string | undefined;
  password: string | undefined;
  connectString: string | undefined;
};
type DbConfigs = { [key: string]: DbConfig };

const dbs: DbConfigs = {
  "100916": {
    user: process.env.DB_HNLT_USER,
    password: process.env.DB_HNLT_PASSWORD,
    connectString: process.env.DB_HNLT_CONNECT_STRING,
  },
  "101000": {
    user: process.env.DB_HNNT_USER,
    password: process.env.DB_HNNT_PASSWORD,
    connectString: process.env.DB_HNNT_CONNECT_STRING,
  },
};

export async function getConnection(g_mabc: string) {
  const dbConf = dbs[g_mabc];
  if (!dbConf) throw new Error("Mã cơ sở không hợp lệ!");
  
  // Kiểm tra thông tin kết nối
  if (!dbConf.user || !dbConf.password || !dbConf.connectString) {
    throw new Error("Thiếu thông tin kết nối database!");
  }

  try {
    return await oracledb.getConnection(dbConf);
  } catch (err: any) {
    console.error("Lỗi kết nối database:", err.message);
    throw new Error("Không thể kết nối đến database!");
  }
}
