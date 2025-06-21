import './config/tsyringe.container';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { json, urlencoded } from 'express';        
import shiftRoutes from './modules/shift/routes/shift.routes';
import { errorMiddleware } from './core/middleware/error.middleware';
import authRoutes from './modules/auth/routes/auth.routes';
import e1Routes from './routes/van-chuyen/e1.routes';
import posRouter from './routes/pos.routes';
import loggingMiddleware from './core/middleware/logging.middleware';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.65.69:5173',
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

// Global Middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(json());
app.use(urlencoded({ extended: true }));
// app.use(morgan('dev')); // Tạm thay thế bằng loggingMiddleware tùy chỉnh
app.use(loggingMiddleware);

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/shift', shiftRoutes);
app.use('/api/van-chuyen/e1', e1Routes);
app.use('/api/pos', posRouter);

// Global Error Handler
app.use(errorMiddleware);

export default app;
