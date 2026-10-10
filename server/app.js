import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

export function createApp() {
  const app = express();

  // Basic Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'ChaiChukta API',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/auth', authRoutes);

  // 404 handler for unmatched API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      error: `API endpoint ${req.method} ${req.originalUrl} not found`,
    });
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error('[Unhandled Server Error]:', err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal server error',
    });
  });

  return app;
}

export default createApp;
