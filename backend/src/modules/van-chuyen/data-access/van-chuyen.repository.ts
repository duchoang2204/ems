import { injectable } from 'tsyringe';
import oracledb from 'oracledb';
import { format } from 'date-fns';
import { IE1Repository } from '../domain/repositories/IE1Repository';
import { SearchE1RequestDto } from '../dto/SearchE1RequestDto';
import { GetE1DetailsRequestDto } from '../dto/GetE1DetailsRequestDto';
import { GetE1DetailsResponseDto, E1DetailInfo, E1BD10Info } from '../dto/GetE1DetailsResponseDto';
import { getConnectionByMaBC } from '../../../config/database/db.config';
import { E1Info } from '../dto/SearchE1ResponseDto';

interface SearchE1OutBinds {
  p_cursor: oracledb.ResultSet<any>;
  p_totalCount: number;
  p_totalWeight: number;
  p_sync_triggered: number;
}

interface GetE1DetailsOutBinds {
  p_e1_cursor: oracledb.ResultSet<any>;
  p_bd10_cursor: oracledb.ResultSet<any>;
}

@injectable()
export class VanChuyenRepositoryOracle implements IE1Repository {

  private async checkSyncStatus(params: SearchE1RequestDto): Promise<{ status: 'PENDING' | 'FAILED' }> {
    const conn = await getConnectionByMaBC('100916');
    let status: 'PENDING' | 'FAILED' = 'PENDING';
    try {
      const sql = `
        SELECT trangthai 
        FROM bccp_mailtriptoget_hktv
        WHERE mabcdong = :mabcDong 
          AND mabcnhan = :mabcNhan
          AND sochuyenthu = :chthu
      `;
      const result = await conn.execute<{ TRANGTHAI: number }>(sql, { 
        mabcDong: params.mabcDong, 
        mabcNhan: params.mabcNhan, 
        chthu: params.chthu 
      });
      
      if (result.rows && result.rows.length > 0) {
        const trangthai = result.rows[0].TRANGTHAI;
        if (trangthai === 2) {
          status = 'FAILED';
        }
      }
    } catch (err) {
      console.error("Lỗi khi kiểm tra trạng thái đồng bộ:", err);
      status = 'FAILED';
    } finally {
      if (conn) await conn.close();
    }
    return { status };
  }

  async searchE1(request: SearchE1RequestDto): Promise<any> {
    const { fromDate, toDate, mabcDong, mabcNhan, chthu, tuiso, khoiluong, page = 1, limit = 10, isPolling = false } = request;
    const offset = (page - 1) * limit;

    // TODO: Xác định đúng mã bưu cục để lấy connection
    // Hiện đang tạm lấy '100916' vì SP được tạo ở DB này
    const conn = await getConnectionByMaBC('100916');

    try {
      const result = await conn.execute<SearchE1OutBinds>(
        `BEGIN
          W_EMS.SEARCH_E1(
            :p_fromDate, :p_toDate, :p_mabcDong, :p_mabcNhan, :p_chthu, :p_tuiso, :p_khoiluong,
            :p_offset, :p_limit,
            :p_cursor, :p_totalCount, :p_totalWeight, :p_sync_triggered
          );
        END;`,
        {
          p_fromDate: fromDate,
          p_toDate: toDate,
          p_mabcDong: mabcDong,
          p_mabcNhan: mabcNhan,
          p_chthu: chthu,
          p_tuiso: tuiso,
          p_khoiluong: khoiluong ? Number(khoiluong) : null,
          p_offset: offset,
          p_limit: limit,
          p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          p_totalCount: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
          p_totalWeight: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
          p_sync_triggered: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }
      );

      if (!result.outBinds) {
        throw new Error("Không nhận được tham số trả về từ Stored Procedure.");
      }

      const outBinds = result.outBinds;
      const resultSet = outBinds.p_cursor;
      const totalCount = outBinds.p_totalCount;
      const totalWeight = outBinds.p_totalWeight;
      const syncTriggered = outBinds.p_sync_triggered;

      const rows = await resultSet.getRows(limit);
      await resultSet.close();
      
      const data: E1Info[] = rows.map((row: any) => ({
        mae1: row.MAE1,
        ngay: row.NGAY,
        khoiluong: row.KHOILUONG,
        mabcDong: row.MABCDONG,
        mabcNhan: row.MABCNHAN,
        chthu: row.CHTHU,
        tuiso: row.TUISO
      }));

      if (data.length > 0) {
        return {
          status: 'SUCCESS',
          data,
          totalCount,
          totalWeight,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit)
        };
      }

      if (isPolling) {
        const syncStatus = await this.checkSyncStatus(request);
        if (syncStatus.status === 'FAILED') {
          return {
            status: 'FAILED',
            message: 'Đồng bộ dữ liệu thất bại. Dữ liệu có thể không tồn tại hoặc có lỗi ở hệ thống nguồn.'
          };
        }
      }

      if (syncTriggered === 1) {
        return { status: 'PENDING' };
      }

      // Nếu chạy đến đây, có nghĩa là không tìm thấy dữ liệu và cũng không kích hoạt đồng bộ.
      // Đây chính là trường hợp "Không tìm thấy trong KPI".
      return {
        status: 'FAILED',
        message: 'Túi thư này chưa được quét xác nhận đến BD10, hoặc thông tin tìm kiếm chưa chính xác.'
      };

    } catch (err: any) {
      console.error('Lỗi khi gọi SP SEARCH_E1:', err);
      return {
        status: 'FAILED',
        message: err.message || 'Có lỗi xảy ra ở phía server.'
      };
    } finally {
      if (conn) await conn.close();
    }
  }

  async getE1Details(request: GetE1DetailsRequestDto): Promise<GetE1DetailsResponseDto> {
    const { mae1, fromDate, toDate } = request;
    // SP được đặt tại DB 100916
    const conn = await getConnectionByMaBC('100916');

    try {
      // Hàm helper để chuyển đổi chuỗi YYYYMMDD thành đối tượng Date
      const parseYyyyMmDd = (dateInput: string | Date | undefined | null): Date | null => {
        if (!dateInput) {
          return null;
        }
        if (dateInput instanceof Date) {
          return dateInput;
        }
        if (typeof dateInput === 'string' && dateInput.length === 8) {
          const year = parseInt(dateInput.substring(0, 4), 10);
          const month = parseInt(dateInput.substring(4, 6), 10) - 1; // Tháng trong JS là 0-indexed
          const day = parseInt(dateInput.substring(6, 8), 10);
          return new Date(year, month, day);
        }
        // Nếu không đúng định dạng, thử chuyển đổi trực tiếp
        const parsedDate = new Date(dateInput);
        // Trả về null nếu ngày không hợp lệ
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
      };

      const result = await conn.execute<GetE1DetailsOutBinds>(
        `BEGIN
          W_EMS.GET_E1_DETAILS(
            :p_mae1,
            :p_fromDate,
            :p_toDate,
            :p_e1_cursor,
            :p_bd10_cursor
          );
        END;`,
        {
          p_mae1: mae1,
          p_fromDate: parseYyyyMmDd(fromDate), // Chuyển đổi trước khi bind
          p_toDate: parseYyyyMmDd(toDate),     // Chuyển đổi trước khi bind
          p_e1_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          p_bd10_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        }
      );

      if (!result.outBinds) {
        throw new Error("Không nhận được tham số trả về từ Stored Procedure GET_E1_DETAILS.");
      }
      
      const e1Cursor = result.outBinds.p_e1_cursor;
      const bd10Cursor = result.outBinds.p_bd10_cursor;

      const e1Rows = await e1Cursor.getRows(); // Lấy tất cả các dòng
      await e1Cursor.close();

      const bd10Rows = await bd10Cursor.getRows();
      await bd10Cursor.close();

      const e1Details: E1DetailInfo[] = e1Rows.map((row: any) => {
        let eventTimestamp: Date;

        // Ưu tiên thời gian thực tế nếu có
        if (row.THOI_GIAN_THUC_TE) {
          eventTimestamp = new Date(row.THOI_GIAN_THUC_TE);
        } else {
          // Nếu không, tạo thời gian từ ngày và giờ kế hoạch
          const ngayKeHoach = String(row.NGAY_KE_HOACH || '');
          const gioKeHoach = String(row.GIO_KE_HOACH || '0'); // Mặc định là 0 nếu null

          const year = parseInt(ngayKeHoach.substring(0, 4), 10);
          const month = parseInt(ngayKeHoach.substring(4, 6), 10) - 1;
          const day = parseInt(ngayKeHoach.substring(6, 8), 10);
          
          let hours = 0;
          let minutes = 0;
          
          if (gioKeHoach.length >= 3) { // Định dạng HMM hoặc HHMM
            hours = Math.floor(parseInt(gioKeHoach, 10) / 100);
            minutes = parseInt(gioKeHoach, 10) % 100;
          } else { // Coi là số phút
            const totalMinutes = parseInt(gioKeHoach, 10);
            hours = Math.floor(totalMinutes / 60);
            minutes = totalMinutes % 60;
          }

          eventTimestamp = new Date(year, month, day, hours, minutes);
        }

        return {
          stt: row.STT,
          eventTimestamp,
          loai: row.LOAI,
          buuCucDong: row.BUUCUCDONG,
          buuCucNhan: row.BUUCUCNHAN,
          thongTinCT: row.THONG_TIN_CT,
        };
      });

      const bd10Details: E1BD10Info[] = bd10Rows.map((row: any) => ({
        stt: row.STT,
        soCt: row.SO_CT,
        ngay: new Date(row.NGAY),
        tu: row.TU,
        den: row.DEN,
        soXe: row.SO_XE,
        gioXuatPhat: row.GIO_XUAT_PHAT,
        gioDen: row.GIO_DEN,
        loaiCt: row.LOAI_CT
      }));
      
      return {
        e1Details,
        bd10Details,
      };
    } catch (err: any) {
      console.error('Lỗi khi gọi SP GET_E1_DETAILS:', err);
      throw new Error('Lỗi hệ thống khi lấy chi tiết E1.');
    } finally {
      if (conn) await conn.close();
    }
  }
} 