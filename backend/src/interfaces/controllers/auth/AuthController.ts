import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { LoginUseCase } from '../../../application/use-cases/auth/LoginUseCase';

@injectable()
export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  async login(req: Request, res: Response) {
    try {
      const { g_mabc, manv, mkhau } = req.body;
      console.log('API /api/auth/login nhận body:', req.body);
      
      // Validate input
      if (!g_mabc || !manv || !mkhau) {
        return res.status(400).json({
          ok: false,
          code: 'INVALID_INPUT',
          msg: 'Vui lòng nhập đầy đủ thông tin!'
        });
      }

      const result = await this.loginUseCase.execute({ g_mabc, manv, mkhau });
      res.json({ ok: true, ...result });
    } catch (err: any) {
      console.error('Lỗi backend login:', err);
      // Handle specific error codes from stored procedure
      switch (err.message) {
        case 'INVALID_G_MABC':
          res.status(400).json({
            ok: false,
            code: err.message,
            msg: 'Mã đơn vị không hợp lệ!'
          });
          break;
        case 'INVALID_CREDENTIALS':
          res.status(401).json({
            ok: false,
            code: err.message,
            msg: 'Mã nhân viên hoặc mật khẩu không chính xác!'
          });
          break;
        case 'SYSTEM_ERROR':
          res.status(500).json({
            ok: false,
            code: err.message,
            msg: 'Lỗi hệ thống, vui lòng thử lại sau!'
          });
          break;
        default:
          res.status(500).json({
            ok: false,
            code: 'UNKNOWN_ERROR',
            msg: 'Đã xảy ra lỗi không xác định!'
          });
      }
    }
  }
} 