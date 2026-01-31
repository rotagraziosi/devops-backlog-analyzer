import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import analysisRoutes from './routes/analysisRoutes';
import healthRoutes from './routes/healthRoutes';
import acceptanceCriteriaRoutes from './routes/acceptanceCriteriaRoutes';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', analysisRoutes);
app.use('/api', healthRoutes);
app.use('/api', acceptanceCriteriaRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'DevOps Agile Props Filling API',
    version: '1.0.0',
    endpoints: {
      analyze: 'GET/POST /api/analyze/:workItemId',
      generateAC: 'GET /api/generate-ac/:workItemId',
      health: 'GET /api/health',
    },
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  });
});

export default app;
