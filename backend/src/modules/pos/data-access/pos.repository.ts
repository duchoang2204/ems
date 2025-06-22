import { injectable } from 'tsyringe';
import oracledb from 'oracledb';
import sql from 'mssql';
import { IPosRepository } from '../domain/repositories/pos.repository.interface';
import { getConnectionByMaBC } from '../../../config/database/db.config';
import { sqlServerPool100916 } from '../../../config/database/sqlServer.config';

interface ValidatePosResult {
  isValid: boolean;
  fallbackName: string | null;
}

@injectable()
export class PosRepository implements IPosRepository {
  
  public async findNameByCode(posCode: string): Promise<string | null> {
    let oracleConn;
    let sqlConn;

    try {
      // Bước 1: Gọi SP VALIDATE_POS để kiểm tra tính hợp lệ
      const validationResult = await this.validatePosWithSP(posCode);
      
      if (!validationResult.isValid) {
        console.log(`[PosRepository] POS code ${posCode} is not valid according to SP.`);
        return null; // POS code không hợp lệ
      }
      
      // Bước 2: Nếu hợp lệ, tìm tên "đẹp" từ SQL Server
      const beautifulName = await this.findBeautifulNameFromSqlServer(posCode);
      
      // Bước 3: Trả về tên đẹp nếu có, không thì dùng fallback name
      return beautifulName || validationResult.fallbackName;
      
    } catch (error) {
      console.error(`[PosRepository] Error in findNameByCode for ${posCode}:`, error);
      return null;
    }
  }

  private async validatePosWithSP(posCode: string): Promise<ValidatePosResult> {
    // Sử dụng connection từ DB có SP (ví dụ: '100916')
    // Cần đảm bảo SP tồn tại trên schema của user/db này
    let oracleConn;
    try {
      oracleConn = await getConnectionByMaBC('100916');
      const result = await oracleConn.execute<{ p_is_valid: number; p_fallback_name: string }>(
        `BEGIN W_WEB.VALIDATE_POS(:p_pos_code, :p_is_valid, :p_fallback_name); END;`,
        {
          p_pos_code: posCode,
          p_is_valid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
          p_fallback_name: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 }
        }
      );

      const outBinds = result.outBinds;
      
      return {
        isValid: outBinds?.p_is_valid === 1,
        fallbackName: outBinds?.p_fallback_name || null
      };
    } finally {
      if (oracleConn) await oracleConn.close();
    }
  }

  private async findBeautifulNameFromSqlServer(posCode: string): Promise<string | null> {
    try {
      const pool = await sqlServerPool100916;
      const result = await pool.request()
        .input('posCode', sql.VarChar, posCode)
        .query(`SELECT tenpos FROM pos WHERE mapos = @posCode`);

      if (result.recordset.length > 0) {
        return result.recordset[0].tenpos;
      }
      return null;
    } catch (error) {
        console.error(`[PosRepository] Error finding beautiful name for ${posCode}:`, error);
        // Không re-throw lỗi để vẫn có thể trả về fallback name
        return null;
    }
  }
} 