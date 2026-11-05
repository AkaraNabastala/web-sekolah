import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { apiRouter } from './backend/src/routes/api.js';
import { testMySQLConnection, getMySQLStatus } from './backend/src/config/database.js';
import { logger } from './backend/src/utils/logger.js';
import { runMigrations } from './backend/src/scripts/migrate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Pastikan direktori uploads tersedia
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  // Mount API router
  app.use('/api', apiRouter);

  // Health check & System info endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      school: 'SMP Islam Caruy',
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/system/database-status', async (_req, res) => {
    const test = await testMySQLConnection();
    const config = getMySQLStatus();
    res.json({
      success: true,
      environment: process.env.NODE_ENV || 'development',
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

  // Uji koneksi MySQL saat boot
  const dbTest = await testMySQLConnection();
  if (dbTest.connected) {
    logger.info('RootServer', `Database connected: ${dbTest.message}`);
    await runMigrations();
  } else {
    logger.warn('RootServer', `Database check: ${dbTest.message}. Fallback data.json aktif.`);
  }

  if (!isProd) {
    // Mode pengembangan dengan Vite dev middleware yang mengarah ke folder frontend/
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: path.resolve(__dirname, 'frontend'),
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Mode produksi menyajikan build dist dari frontend
    const distDir = path.resolve(__dirname, 'frontend/dist');
    const fallbackDistDir = path.resolve(__dirname, 'dist');
    const targetDist = fs.existsSync(distDir) ? distDir : fallbackDistDir;
    app.use(express.static(targetDist));
    app.get('{*path}', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return next();
      }
      res.sendFile(path.join(targetDist, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SMP Islam Caruy] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[SMP Islam Caruy] Gagal menjalankan server:', err);
  process.exit(1);
});
