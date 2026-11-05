import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { apiRouter } from './backend/routes/api.js';
import { testMySQLConnection, getMySQLStatus } from './backend/config/database.js';
import { logger } from './backend/utils/logger.js';
import { runMigrations } from './backend/scripts/migrate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Mount API router
app.use('/api', apiRouter);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    school: 'SMP Islam Caruy',
    mode: 'production',
    timestamp: new Date().toISOString()
  });
});

// Database & System status
app.get('/api/system/database-status', async (_req, res) => {
  const test = await testMySQLConnection();
  const config = getMySQLStatus();
  res.json({
    success: true,
    environment: 'production',
    mysql: {
      configured: config.configured,
      connected: test.connected,
      message: test.message,
      host: config.host,
      port: config.port,
      database: config.database
    },
    fallback_storage: {
      engine: 'Atomic Persistent JSON Relational Store',
      status: 'Active & Synchronized',
      file: 'database/data.json'
    }
  });
});

// Serve frontend static files
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// SPA catch-all fallback
app.get('{*path}', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Boot & Lifecycle
async function startProductionServer() {
  logger.info('ProductionServer', 'Memulai Server Produksi SMP Islam Caruy...');

  const dbCheck = await testMySQLConnection();
  if (dbCheck.connected) {
    logger.info('ProductionServer', dbCheck.message);
    await runMigrations();
  } else {
    logger.warn('ProductionServer', `MySQL: ${dbCheck.message}. Fallback data.json aktif.`);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info('ProductionServer', `Server running on http://0.0.0.0:${PORT} [PRODUCTION]`);
  });

  const shutdown = (signal) => {
    logger.info('ProductionServer', `Menerima ${signal}. Menutup server...`);
    server.close(() => {
      logger.info('ProductionServer', 'HTTP Server berhasil ditutup.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

process.on('unhandledRejection', (reason) => {
  logger.error('UnhandledRejection', reason?.message || String(reason), reason);
});

process.on('uncaughtException', (err) => {
  logger.error('UncaughtException', err.message, err);
  process.exit(1);
});

startProductionServer().catch((err) => {
  logger.error('ProductionBootstrapError', err.message, err);
  process.exit(1);
});
