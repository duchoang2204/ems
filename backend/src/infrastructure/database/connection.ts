import oracledb from 'oracledb';

export async function getConnectionByMaBC(g_mabc: string) {
  const dbKey = g_mabc.startsWith("1009") ? "HNLT" : "HNNT";
  const conn = await oracledb.getConnection(dbKey);
  return conn;
} 