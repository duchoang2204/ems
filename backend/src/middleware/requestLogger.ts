export const requestLogger = (req, res, next) => {
  const user = req.user?.manv || "anonymous";
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - User: ${user}`);
  next();
};
