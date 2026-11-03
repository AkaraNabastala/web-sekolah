import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { apiRouter } from './routes/api.js';
import { checkConnection, getStatus } from './config/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API routes
app.use('/api', apiRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    school: 'SMP Islam Caruy',
    server_time: new Date().toISOString()
  });
});

app.get('/api/system/database-status', async (_req, res) => {
  const check = await checkConnection();
  const st = getStatus();
  res.json({
    success: true,
    mysql: {
      configured: st.configured,
      connected: check.connected,
      message: check.message,
      host: st.host,
      port: st.port,
      database: st.database
    }
  });
});

// Production static files (if built frontend placed in ../frontend/dist)
const clientDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('{*path}', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

async function start() {
  const dbCheck = await checkConnection();
  console.log(`[SMP Islam Caruy Backend] ${dbCheck.message}`);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SMP Islam Caruy Backend] Service running on http://0.0.0.0:${PORT}`);
  });
}

start().catch(err => {
  console.error('[Backend Startup Error]', err);
  process.exit(1);
});
