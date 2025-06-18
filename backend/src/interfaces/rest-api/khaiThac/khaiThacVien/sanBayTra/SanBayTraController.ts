// src/interfaces/rest-api/khaiThac/khaiThacVien/sanBayTra/SanBayTraController.ts

import { Router } from 'express';
import { SanBayTraService } from '@/application/services/khaiThac/khaiThacVien/sanBayTra/SanBayTraService';
import { E1RepositoryOracle } from '@/infrastructure/repositories/khaiThac/khaiThacVien/sanBayTra/E1RepositoryOracle';
import { E2RepositoryOracle } from '@/infrastructure/repositories/khaiThac/khaiThacVien/sanBayTra/E2RepositoryOracle';
import { WQuanLyHktvRepositoryOracle } from '@/infrastructure/repositories/khaiThac/khaiThacVien/sanBayTra/WQuanLyHktvRepositoryOracle';
import { TaoE2DenService } from '@/domain/services/khaiThac/khaiThacVien/sanBayTra/TaoE2DenService';
import { SanBayTraDomainService } from '@/domain/services/khaiThac/khaiThacVien/sanBayTra/SanBayTraDomainService';
import { getOracleConnection } from '@/infrastructure/oracle/OracleConnection';

const router = Router();

// Khởi tạo repository
const e1Repository = new E1RepositoryOracle();
const e2Repository = new E2RepositoryOracle();
const wQuanLyHktvRepository = new WQuanLyHktvRepositoryOracle();

// Khởi tạo domain service
const taoE2DenService = new TaoE2DenService(e2Repository);
const sanBayTraDomainService = new SanBayTraDomainService(
  e1Repository,
  e2Repository,
  wQuanLyHktvRepository,
  taoE2DenService
);

// Khởi tạo application service
const sanBayTraService = new SanBayTraService(sanBayTraDomainService);

// ==== API 1: Xác nhận đến ====
router.post('/khai-thac/khai-thac-vien/san-bay-tra/xac-nhan-den', async (req, res) => {
  try {
    const input = req.body;
    await sanBayTraService.xacNhanDen(input);
    res.json({ success: true });
  } catch (error) {
    console.error('Error in XacNhanDen:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==== API 2: Danh sách túi/kiện ====
router.get('/khai-thac/khai-thac-vien/san-bay-tra/danh-sach-tui-kien', async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const connection = await getOracleConnection();

    const sql = `
      SELECT
        e.id_e2,
        e.mabc_kt,
        e.mabc,
        e.chthu,
        e.tuiso,
        e.khoiluong,
        e.ngay,
        NVL(w.ischon, 0) AS ischon
      FROM e2i2 e
      LEFT JOIN w_quanly_hktv w
        ON w.ngay = e.ngay
       AND w.mabc_kt = e.mabc_kt
       AND w.mabc = e.mabc
       AND w.chthu = e.chthu
       AND w.tuiso = e.tuiso
       AND w.id_e2 = e.id_e2
      WHERE e.ngay BETWEEN :fromDate AND :toDate
        AND e.id_e2 IS NOT NULL
        AND LENGTH(TRIM(e.id_e2)) > 0
    `;

    const result = await connection.execute(
      sql,
      {
        fromDate: Number(fromDate),
        toDate: Number(toDate),
      },
      { outFormat: 4002 }
    );

    const data = result.rows?.map((row: any) => ({
      id_e2: row.ID_E2,
      mabc_kt: row.MABC_KT,
      mabc: row.MABC,
      chthu: row.CHTHU,
      tuiso: row.TUISO,
      khoiluong: row.KHOILUONG,
      ngay: row.NGAY,
      ischon: row.ISCHON,
    }));

    res.json(data || []);
  } catch (error) {
    console.error('Error in /danh-sach-tui-kien:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==== API 3: Danh sách mã E1 ====
router.get('/khai-thac/khai-thac-vien/san-bay-tra/ma-e1', async (req, res) => {
  try {
    const { mabc_kt, mabc, chthu, tuiso, ngay } = req.query;

    const connection = await getOracleConnection();

    const sql = `
      SELECT
        e1.mae1,
        e1.khoiluong,
        COALESCE(we1.ghichu, '') AS ghichu,
        COALESCE(we1.hanhtrinh, '') AS hanhtrinh,
        COALESCE(we1.noidung, '') AS noidung,
        e1.trangthai
      FROM e1i2 e1
      LEFT JOIN w_quanly_e1_hktv we1
        ON we1.mae1 = e1.mae1
      WHERE e1.ngay = :ngay
        AND e1.mabc_kt = :mabc_kt
        AND e1.mabc = :mabc
        AND e1.chthu = :chthu
        AND e1.tuiso = :tuiso
    `;

    const result = await connection.execute(
      sql,
      {
        ngay: Number(ngay),
        mabc_kt: Number(mabc_kt),
        mabc: Number(mabc),
        chthu: Number(chthu),
        tuiso: Number(tuiso),
      },
      { outFormat: 4002 }
    );

    const data = result.rows?.map((row: any) => ({
      mae1: row.MAE1,
      khoiluong: row.KHOILUONG,
      ghichu: row.GHICHU,
      hanhtrinh: row.HANHTRINH,
      noidung: row.NOIDUNG,
      trangthai: row.TRANGTHAI,
    }));

    res.json(data || []);
  } catch (error) {
    console.error('Error in /ma-e1:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
