import { Request, Response, NextFunction } from "express";

export function requireRole(level: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).user?.mucdo >= level) next();
    else res.status(403).json({ ok: false, code: "FORBIDDEN", msg: "Bạn không có quyền truy cập chức năng này!" });
  }
}

