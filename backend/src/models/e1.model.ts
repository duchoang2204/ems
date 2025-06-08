import oracledb from "oracledb";
import { getDbConnection } from "../utils/dbUtil";
import { E1SearchRequest, E1SearchResult, E1DetailInfo, E1BD10Info } from "../types/e1.types";

export class E1Model {
  private static getTableConfig(mabcNhan: string | undefined): { tableName: string; dbConfig: string } {
    if (["100916", "101000", "700916"].includes(mabcNhan || "")) {
      if (mabcNhan === "100916") {
        return { tableName: "e1e2", dbConfig: "HNLT" };
      } else if (mabcNhan === "101000") {
        return { tableName: "e1e1", dbConfig: "HNNT" };
      } else {
        return { tableName: "e1e2", dbConfig: "HCMLT" };
      }
    }
    return { tableName: "e1e2_hktv", dbConfig: "HCMLT" };
  }

  static async search(params: E1SearchRequest): Promise<{
    rows: any[];
    totalCount: number;
    totalWeight: number;
  }> {
    const { fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong, page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;
    const { tableName, dbConfig } = this.getTableConfig(mabcNhan);

    const sql = `
      SELECT * FROM (
        SELECT a.*, ROWNUM rnum
        FROM (
          SELECT mae1, TO_CHAR(TO_DATE(ngay, 'YYYYMMDD'), 'DD/MM/YYYY') AS ngay, khoiluong
          FROM ${tableName}
          WHERE ngay BETWEEN :fromDate AND :toDate
            AND mabc_kt = :mabcDong
            AND mabc = :mabcNhan
            AND chthu = :chthu
            AND tuiso = :tuiso
            AND (:khoiluong IS NULL OR khoiluong = :khoiluong)
          ORDER BY ngay DESC, mae1
        ) a
        WHERE ROWNUM <= :maxRow
      ) WHERE rnum > :offset
    `;

    const conn = await getDbConnection(dbConfig);
    const result = await conn.execute(
      sql,
      {
        fromDate,
        toDate,
        mabcDong,
        mabcNhan,
        chthu,
        tuiso,
        khoiluong,
        maxRow: offset + limit,
        offset: offset
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    let rows: any[] = result.rows as any[];

    // Fallback search in HNLT if no results found in HCMLT
    if (tableName === "e1e2_hktv" && rows.length === 0 && dbConfig === "HCMLT") {
      const fallbackConn = await getDbConnection("HNLT");
      const fallbackResult = await fallbackConn.execute(
        sql,
        {
          fromDate,
          toDate,
          mabcDong,
          mabcNhan,
          chthu,
          tuiso,
          khoiluong,
          maxRow: offset + limit,
          offset: offset
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      await fallbackConn.close();
      rows = fallbackResult.rows as any[];
    }

    // Get total count and weight
    const countSql = `
      SELECT COUNT(*) as total, SUM(khoiluong) as total_weight
      FROM ${tableName}
      WHERE ngay BETWEEN :fromDate AND :toDate
        AND mabc_kt = :mabcDong
        AND mabc = :mabcNhan
        AND chthu = :chthu
        AND tuiso = :tuiso
        AND (:khoiluong IS NULL OR khoiluong = :khoiluong)
    `;

    const countConn = await getDbConnection(dbConfig);
    const countResult = await countConn.execute(
      countSql,
      { fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await countConn.close();

    const totalCount = (countResult.rows as any[])[0].TOTAL;
    const totalWeight = (countResult.rows as any[])[0].TOTAL_WEIGHT || 0;

    return { rows, totalCount, totalWeight };
  }

  static async getDetails(mae1: string): Promise<{
    e1Details: E1DetailInfo[];
    bd10Details: E1BD10Info[];
  }> {
    // TODO: Implement E1 details query
    return {
      e1Details: [],
      bd10Details: []
    };
  }
} 