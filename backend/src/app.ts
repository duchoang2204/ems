import './config/tsyringe.container';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'express';        
import shiftRoutes from './modules/shift/routes/shift.routes';
import { errorMiddleware } from './core/middleware/error.middleware';
import authRoutes from './modules/auth/routes/auth.routes';


const app = express();

// Global Middlewares
app.use(cors());
app.use(helmet());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/shift', shiftRoutes);

// Global Error Handler
app.use(errorMiddleware);

export default app;
