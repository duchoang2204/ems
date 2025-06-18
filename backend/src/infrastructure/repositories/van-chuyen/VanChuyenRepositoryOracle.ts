import { injectable } from 'tsyringe';
import { IE1Repository } from '../../../domain/repositories/van-chuyen/IE1Repository';
import { SearchE1RequestDto } from '../../../application/dto/van-chuyen/SearchE1RequestDto';
import { SearchE1ResponseDto, E1Info } from '../../../application/dto/van-chuyen/SearchE1ResponseDto';
import { GetE1DetailsRequestDto } from '../../../application/dto/van-chuyen/GetE1DetailsRequestDto';
import { GetE1DetailsResponseDto } from '../../../application/dto/van-chuyen/GetE1DetailsResponseDto';
import { getConnectionByMaBC } from '../../config/database/db.config';
import oracledb from 'oracledb';

interface CountResult {
  TOTAL_COUNT: number;
  TOTAL_WEIGHT: number;
}

@injectable()
export class VanChuyenRepositoryOracle implements IE1Repository {
  async searchE1(request: SearchE1RequestDto): Promise<SearchE1ResponseDto> {
    const {
      fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong, page = 1, limit = 10
    } = request;

    let result;
    let totalCount = 0;
    let totalWeight = 0;
    const offset = (page - 1) * limit;

    if (mabcNhan && ["100916", "700916", "101000"].includes(mabcNhan)) {
      const tableName = mabcNhan === "101000" ? "e1e1" : "e1e2";
      const conn = await getConnectionByMaBC(mabcNhan);
      const countSql = `
        SELECT COUNT(*) as total_count, SUM(khoiluong) as total_weight
        FROM ${tableName}
        WHERE ngay BETWEEN :fromDate AND :toDate
          AND mabc_kt = :mabcDong
          AND mabc = :mabcNhan
          AND chthu = :chthu
          AND tuiso = :tuiso
          AND (:khoiluong IS NULL OR khoiluong = :khoiluong)
      `;
      const countResult = await conn.execute(countSql,
        { fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (countResult.rows?.[0]) {
        const row = countResult.rows[0] as CountResult;
        totalCount = row.TOTAL_COUNT;
        totalWeight = row.TOTAL_WEIGHT || 0;
      }
      const sql = `
        SELECT mae1, TO_CHAR(TO_DATE(ngay, 'YYYYMMDD'), 'DD/MM/YYYY') AS ngay, khoiluong, mabc_kt as mabcDong, mabc as mabcNhan, chthu, tuiso
        FROM ${tableName}
        WHERE ngay BETWEEN :fromDate AND :toDate
          AND mabc_kt = :mabcDong
          AND mabc = :mabcNhan
          AND chthu = :chthu
          AND tuiso = :tuiso
          AND (:khoiluong IS NULL OR khoiluong = :khoiluong)
        ORDER BY ngay DESC, mae1
        OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
      `;
      result = await conn.execute(sql,
        { fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong, offset, limit },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      await conn.close();
    } else if (mabcDong && ["100916", "700916", "101000"].includes(mabcDong)) {
      const tableName = mabcDong === "101000" ? "e1i1" : "e1i2";
      const conn = await getConnectionByMaBC(mabcDong);
      const countSql = `
        SELECT COUNT(*) as total_count, SUM(khoiluong) as total_weight
        FROM ${tableName}
        WHERE ngay BETWEEN :fromDate AND :toDate
          AND mabc_kt = :mabcDong
          AND mabc = :mabcNhan
          AND chthu = :chthu
          AND tuiso = :tuiso
          AND (:khoiluong IS NULL OR khoiluong = :khoiluong)
      `;
      const countResult = await conn.execute(countSql,
        { fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (countResult.rows?.[0]) {
        const row = countResult.rows[0] as CountResult;
        totalCount = row.TOTAL_COUNT;
        totalWeight = row.TOTAL_WEIGHT || 0;
      }
      const sql = `
        SELECT mae1, TO_CHAR(TO_DATE(ngay, 'YYYYMMDD'), 'DD/MM/YYYY') AS ngay, khoiluong, mabc_kt as mabcDong, mabc as mabcNhan, chthu, tuiso
        FROM ${tableName}
        WHERE ngay BETWEEN :fromDate AND :toDate
          AND mabc_kt = :mabcDong
          AND mabc = :mabcNhan
          AND chthu = :chthu
          AND tuiso = :tuiso
          AND (:khoiluong IS NULL OR khoiluong = :khoiluong)
        ORDER BY ngay DESC, mae1
        OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
      `;
      result = await conn.execute(sql,
        { fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong, offset, limit },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      await conn.close();
    } else {
      // Thử tìm trong e1e2_hktv của HCMLT
      let conn = await getConnectionByMaBC('700916');
      let countSql = `
        SELECT COUNT(*) as total_count, SUM(khoiluong) as total_weight
        FROM e1e2_hktv
        WHERE ngay BETWEEN :fromDate AND :toDate
          AND mabc_kt = :mabcDong
          AND mabc = :mabcNhan
          AND chthu = :chthu
          AND tuiso = :tuiso
          AND (:khoiluong IS NULL OR khoiluong = :khoiluong)
      `;
      let countResult = await conn.execute(countSql,
        { fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (countResult.rows?.[0]) {
        const row = countResult.rows[0] as CountResult;
        totalCount = row.TOTAL_COUNT;
        totalWeight = row.TOTAL_WEIGHT || 0;
      }
      let sql = `
        SELECT mae1, TO_CHAR(TO_DATE(ngay, 'YYYYMMDD'), 'DD/MM/YYYY') AS ngay, khoiluong, mabc_kt as mabcDong, mabc as mabcNhan, chthu, tuiso
        FROM e1e2_hktv
        WHERE ngay BETWEEN :fromDate AND :toDate
          AND mabc_kt = :mabcDong
          AND mabc = :mabcNhan
          AND chthu = :chthu
          AND tuiso = :tuiso
          AND (:khoiluong IS NULL OR khoiluong = :khoiluong)
        ORDER BY ngay DESC, mae1
        OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
      `;
      result = await conn.execute(sql,
        { fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong, offset, limit },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      await conn.close();
      // Nếu không có dữ liệu, thử tìm trong e1e2_hktv của HNLT
      if (!result.rows?.length) {
        conn = await getConnectionByMaBC('100916');
        countResult = await conn.execute(countSql,
          { fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        if (countResult.rows?.[0]) {
          const row = countResult.rows[0] as CountResult;
          totalCount = row.TOTAL_COUNT;
          totalWeight = row.TOTAL_WEIGHT || 0;
        }
        result = await conn.execute(sql,
          { fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong, offset, limit },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        await conn.close();
        // Nếu vẫn không có dữ liệu, thử tìm trong kpi_postbag_bccp của HNLT
        if (!result.rows?.length) {
          conn = await getConnectionByMaBC('100916');
          countSql = `
            SELECT COUNT(*) as total_count, 0 as total_weight
            FROM kpi_postbag_bccp
            WHERE mailtripdate BETWEEN :fromDate AND :toDate
              AND fromposcode = :mabcDong
              AND toposcode = :mabcNhan
              AND mailtripnumber = :chthu
              AND postbagindex = :tuiso
              AND (:khoiluong IS NULL OR totalweight = :khoiluong)
          `;
          countResult = await conn.execute(countSql,
            { fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
          if (countResult.rows?.[0]) {
            const row = countResult.rows[0] as CountResult;
            totalCount = row.TOTAL_COUNT;
            totalWeight = row.TOTAL_WEIGHT || 0;
          }
          sql = `
            SELECT postbagcode as mae1, TO_CHAR(TO_DATE(mailtripdate, 'YYYYMMDD'), 'DD/MM/YYYY') AS ngay, totalweight as khoiluong, fromposcode as mabcDong, toposcode as mabcNhan, mailtripnumber as chthu, postbagindex as tuiso
            FROM kpi_postbag_bccp
            WHERE mailtripdate BETWEEN :fromDate AND :toDate
              AND fromposcode = :mabcDong
              AND toposcode = :mabcNhan
              AND mailtripnumber = :chthu
              AND postbagindex = :tuiso
              AND (:khoiluong IS NULL OR totalweight = :khoiluong)
            ORDER BY mailtripdate DESC, postbagcode
            OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
          `;
          result = await conn.execute(sql,
            { fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong, offset, limit },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
          await conn.close();
        }
      }
    }
    const data: E1Info[] = (result?.rows || []).map((row: any) => ({
      mae1: row.MAE1,
      ngay: row.NGAY,
      khoiluong: row.KHOILUONG,
      mabcDong: row.MABCDONG,
      mabcNhan: row.MABCNHAN,
      chthu: row.CHTHU,
      tuiso: row.TUISO
    }));
    return {
      data,
      totalCount,
      totalWeight,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    };
  }

  // TODO: getE1Details cần chuẩn hóa lại theo nghiệp vụ
  async getE1Details(request: GetE1DetailsRequestDto): Promise<GetE1DetailsResponseDto> {
    throw new Error('Not implemented');
  }
} 