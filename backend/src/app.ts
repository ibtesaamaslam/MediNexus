import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import analyticsRoutes from './routes/analytics.routes';

const app = express();

// Security & Utility Middleware
app.use(helmet() as any);
app.use(cors() as any);
app.use(express.json() as any);
app.use(morgan('dev') as any);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// API Routes
app.use('/api', routes);
app.use('/api/analytics', analyticsRoutes);

export default app;