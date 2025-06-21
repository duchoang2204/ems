// Server → dùng để chạy backend
import 'reflect-metadata'; // BẮT BUỘC PHẢI CÓ DÒNG NÀY Ở ĐẦU TIÊN
import app from "./app";
import dotenv from "dotenv";
import oracledb from 'oracledb';
import { dbConfigHNLT, dbConfigHNNT, dbConfigHCMLT } from './config/database/db.config';

dotenv.config();

const port = process.env.PORT || 4000;

async function initOraclePools() {
  await oracledb.createPool({ ...dbConfigHNLT, poolAlias: 'HNLT' });
  await oracledb.createPool({ ...dbConfigHNNT, poolAlias: 'HNNT' });
  await oracledb.createPool({ ...dbConfigHCMLT, poolAlias: 'HCMLT' });
  console.log('All Oracle pools created!');
}

initOraclePools()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to create Oracle pools:', err);
    process.exit(1);
  });

process.on('SIGINT', async () => {
  try {
    await oracledb.getPool('HNLT').close(10);
    await oracledb.getPool('HNNT').close(10);
    await oracledb.getPool('HCMLT').close(10);
    console.log('All Oracle pools closed!');
    process.exit(0);
  } catch (err) {
    console.error('Error closing Oracle pools:', err);
    process.exit(1);
  }
});
