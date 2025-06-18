import sql from 'mssql';

const sqlServerConfig100916 = {
  user: process.env.SQLSERVER_100916_USER as string,
  password: process.env.SQLSERVER_100916_PASSWORD as string,
  server: process.env.SQLSERVER_100916_HOST as string,
  database: process.env.SQLSERVER_100916_DATABASE as string,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Pool connect → dùng ở VanChuyenRepositorySQLServer
export const sqlServerPool100916 = new sql.ConnectionPool(sqlServerConfig100916).connect();
