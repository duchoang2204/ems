import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { LoginUseCase } from '../usecases/login.usecase';
import { AUTH_TOKENS } from '../di/tokens';

@injectable()
export class AuthController {
  constructor(
    @inject(AUTH_TOKENS.LoginUseCase)
    private loginUseCase: LoginUseCase
  ) {}

  async login(req: Request, res: Response) {
    const t0 = Date.now();
    try {
      const { g_mabc, manv, mkhau } = req.body;
      const t1 = Date.now();
      // Validate input
      if (!g_mabc || !manv || !mkhau) {
        return res.status(400).json({
          ok: false,
          code: 'INVALID_INPUT',
          msg: 'Vui lòng nhập đầy đủ thông tin!'
        });
      }
      const t2 = Date.now();
      const result = await this.loginUseCase.execute({ g_mabc, manv, mkhau });
      const t3 = Date.now();
      res.json({ ok: true, ...result });
      const t4 = Date.now();
      console.log('[LOGIN] Time nhận request:', t1 - t0, 'ms');
      console.log('[LOGIN] Time validate input:', t2 - t1, 'ms');
      console.log('[LOGIN] Time gọi usecase:', t3 - t2, 'ms');
      console.log('[LOGIN] Time trả response:', t4 - t3, 'ms');
      console.log('[LOGIN] Tổng thời gian:', t4 - t0, 'ms');
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