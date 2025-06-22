import { Request, Response, NextFunction } from 'express';
import { User } from '../modules/auth/domain/entities/user.entity';
import { checkShiftValid } from '../modules/shift';

export const requireActiveShift = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    if (!user || !user.g_mabc) {
      return res.status(401).json({ ok: false, msg: 'Không xác định được người dùng hoặc mã đơn vị!' });
    }

    const now = new Date();
    const yyyymmdd = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    const hhmm = now.getHours() * 100 + now.getMinutes();

    const result = await checkShiftValid(user.g_mabc, yyyymmdd, hhmm);
    if (!result.ok) {
      return res.status(403).json({ ok: false, msg: result.msg || 'Không trong thời gian ca làm việc!' });
    }

    next();
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Lỗi xác thực ca làm việc!' });
  }
}; 