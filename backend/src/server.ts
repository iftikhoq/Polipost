import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import templateRoutes from './routes/template.routes.js';
import posterRoutes from './routes/poster.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const app = express();

// Security and CORS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: '*', // Allow client connections
    credentials: true,
  })
);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static directory for uploaded/rendered assets
const uploadsDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Polipost API', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/posters', posterRoutes);
app.use('/api/upload', uploadRoutes);

// Global Error Handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDB();
  const server = app.listen(ENV.PORT, () => {
    console.log(`[Polipost Backend] Server running on http://localhost:${ENV.PORT} in ${ENV.NODE_ENV} mode`);
  });

  process.on('SIGTERM', () => {
    console.log('[Polipost Backend] SIGTERM received, shutting down gracefully...');
    server.close(() => process.exit(0));
  });
};

startServer();
