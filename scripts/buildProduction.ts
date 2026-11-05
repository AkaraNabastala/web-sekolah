import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DEPLOY_DIR = path.join(ROOT_DIR, 'deployment');

function logStep(step: string) {
  console.log(`\n======================================================`);
  console.log(`🚀 [BUILD PRODUCTION] ${step}`);
  console.log(`======================================================`);
}

function runCmd(cmd: string, cwd: string = ROOT_DIR) {
  console.log(`> Menjalankan: ${cmd} (di ${cwd})`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function copyRecursive(src: string, dest: string) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

async function buildProduction() {
  const startTime = Date.now();

  try {
    // 1. Verifikasi tipe TypeScript Backend
    logStep('1/6: Kompilasi TypeScript Backend');
    runCmd('npm run build', path.join(ROOT_DIR, 'backend'));

    // 2. Verifikasi tipe dan Build Frontend
    logStep('2/6: Kompilasi & Build Frontend (Vite Production)');
    runCmd('npm run build', path.join(ROOT_DIR, 'frontend'));

    // 3. Bersihkan & Siapkan folder deployment
    logStep('3/6: Menyiapkan Struktur Direktori deployment/');
    if (fs.existsSync(DEPLOY_DIR)) {
      fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(DEPLOY_DIR, { recursive: true });
    fs.mkdirSync(path.join(DEPLOY_DIR, 'public'), { recursive: true });
    fs.mkdirSync(path.join(DEPLOY_DIR, 'uploads'), { recursive: true });
    fs.mkdirSync(path.join(DEPLOY_DIR, 'logs'), { recursive: true });
    fs.mkdirSync(path.join(DEPLOY_DIR, 'database'), { recursive: true });

    // 4. Salin Hasil Build
    logStep('4/6: Menyalin Aset Statis Frontend & Backend Terkompilasi');
    // Salin dist frontend ke deployment/public
    copyRecursive(path.join(ROOT_DIR, 'frontend', 'dist'), path.join(DEPLOY_DIR, 'public'));
    // Salin backend dist ke deployment/backend
    copyRecursive(path.join(ROOT_DIR, 'backend', 'dist'), path.join(DEPLOY_DIR, 'backend'));
    // Salin schema, seed SQL & fallback data.json dari backend/database
    copyRecursive(path.join(ROOT_DIR, 'backend', 'database', 'schema.sql'), path.join(DEPLOY_DIR, 'database', 'schema.sql'));
    copyRecursive(path.join(ROOT_DIR, 'backend', 'database', 'seeds'), path.join(DEPLOY_DIR, 'database', 'seeds'));
    copyRecursive(path.join(ROOT_DIR, 'backend', 'database', 'data.json'), path.join(DEPLOY_DIR, 'database', 'data.json'));

    // 5. Generate package.json dan server entry point khusus deployment
    logStep('5/6: Menyiapkan Production Server Runner & Ketergantungan Bersih');

    const backendPkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'backend', 'package.json'), 'utf8'));
    const deployPkg = {
      name: 'smp-islam-caruy-production',
      version: '2.0.0',
      private: true,
      type: 'module',
      scripts: {
        start: 'node server.js',
        'setup-admin': 'node backend/scripts/setupAdmin.js',
        migrate: 'node backend/scripts/migrate.js'
      },
      dependencies: {
        ...backendPkg.dependencies
      }
    };

    fs.writeFileSync(
      path.join(DEPLOY_DIR, 'package.json'),
      JSON.stringify(deployPkg, null, 2),
      'utf8'
    );

    // Salin .env.example
    fs.copyFileSync(
      path.join(ROOT_DIR, '.env.example'),
      path.join(DEPLOY_DIR, '.env.example')
    );

    // Buat server.js produksi di root deployment/
    const prodServerCode = `import 'dotenv/config';
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
      enabled: process.env.ALLOW_JSON_FALLBACK === 'true' && process.env.NODE_ENV !== 'production',
      status: 'Development offline only'
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
  if (!dbCheck.connected) {
    throw new Error(`MySQL wajib tersedia pada production: ${dbCheck.message}`);
  }

  logger.info('ProductionServer', dbCheck.message);
  const migration = await runMigrations();
  if (!migration.success) {
    throw new Error(`Database migration gagal: ${migration.message}`);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info('ProductionServer', \`Server running on http://0.0.0.0:\${PORT} [PRODUCTION]\`);
  });

  const shutdown = (signal) => {
    logger.info('ProductionServer', \`Menerima \${signal}. Menutup server...\`);
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
`;
    fs.writeFileSync(path.join(DEPLOY_DIR, 'server.js'), prodServerCode, 'utf8');

    // Buat README instruksi hosting
    const hostingReadme = `# Panduan Deployment SMP Islam Caruy

Paket ini dirancang untuk hosting berbasis Node.js (cPanel Node.js Selector, VPS Ubuntu/Debian, Docker, Railway, dsb.).

## 1. Persiapan Environment
Salin file \`.env.example\` menjadi \`.env\`:
\`\`\`bash
cp .env.example .env
\`\`\`
Sesuaikan nilai variabel lingkungan dengan konfigurasi hosting/database Anda.

## 2. Instalasi Dependensi
Jalankan di server hosting:
\`\`\`bash
npm install --omit=dev
\`\`\`

## 3. Menjalankan Aplikasi
\`\`\`bash
npm start
\`\`\`
Aplikasi akan aktif melayani website publik dan API pada port yang ditentukan (default 3000).

## 4. Setup Administrator Pertama
Jika database baru dibuat dan belum memiliki admin:
\`\`\`bash
npm run setup-admin
\`\`\`
`;
    fs.writeFileSync(path.join(DEPLOY_DIR, 'README_HOSTING.md'), hostingReadme, 'utf8');

    // 6. Audit Keamanan Paket: Verifikasi tidak ada file rahasia
    logStep('6/6: Verifikasi Keamanan Paket Deployment');
    const forbiddenFiles = ['.env', '.git', 'backup_snapshot', 'node_modules'];
    for (const forbidden of forbiddenFiles) {
      if (fs.existsSync(path.join(DEPLOY_DIR, forbidden))) {
        throw new Error(`PERINGATAN KEAMANAN: Ditemukan berkas terlarang ${forbidden} pada paket deployment!`);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n======================================================`);
    console.log(`✅ [BERHASIL] Paket produksi siap di folder: ./deployment/`);
    console.log(`⏱️ Waktu build: ${duration} detik`);
    console.log(`======================================================\n`);
  } catch (err: any) {
    console.error(`\n❌ [GAGAL] Build produksi gagal:`, err.message);
    process.exit(1);
  }
}

buildProduction();
