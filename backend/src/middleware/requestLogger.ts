import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user?.manv || "anonymous";
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - User: ${user}`);
  next();
};
