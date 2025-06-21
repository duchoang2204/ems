import { Request, Response, NextFunction } from 'express';

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;
    const contentLength = res.get('Content-Length') || 0;

    const logMessage = `[API] ${method} ${originalUrl} ${statusCode} - ${duration}ms - ${contentLength}b`;

    if (statusCode >= 400) {
      console.error(logMessage); // Log lỗi bằng console.error để có màu đỏ
    } else {
      console.log(logMessage);
    }
  });

  next();
};

export default loggingMiddleware; 