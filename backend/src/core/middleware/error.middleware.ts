import { Request, Response, NextFunction } from 'express';
export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  res.status(err.status || 500).json({ ok: false, msg: err.message || 'Internal Server Error' });
} 