import { getPool, checkConnection, getStatus } from '../config/database.js';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Script Migrasi Database MySQL
 * Menjamin seluruh skema tabel yang dibutuhkan sistem dibuat pada database yang sedang aktif
 * secara idempotent (IF NOT EXISTS), tanpa ketergantungan pada perintah 'USE database_lain'.
 */
export async function runMigrations(): Promise<{ success: boolean; message: string; details?: any }> {
  logger.info('MigrationService', 'Memulai verifikasi dan eksekusi skema database MySQL...');

  const connStatus = await checkConnection();
  if (!connStatus.connected) {
    const msg = `MySQL tidak aktif atau tidak dapat dijangkau: ${connStatus.message}. Migrasi database dilewati.`;
    logger.warn('MigrationService', msg);
    return { success: false, message: msg };
  }

  const pool = getPool();
  const dbInfo = getStatus();

  try {
    // 1. Baca schema.sql utama
    const scriptDir = path.dirname(fileURLToPath(import.meta.url));
    const backendRoot = path.resolve(scriptDir, '../../');
    const schemaPath = path.join(backendRoot, 'database', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Berkas schema.sql tidak ditemukan pada path: ${schemaPath}`);
    }

    const rawSchema = fs.readFileSync(schemaPath, 'utf8');

    // Filter baris yang memuat instruksi 'CREATE DATABASE' atau 'USE' agar migrasi selalu menggunakan database koneksi aktif
    // Hapus komentar SQL sebelum pemisahan statement. Komentar baris sebelumnya
    // membuat CREATE TABLE terbuang jika parser hanya memeriksa awalan statement.
    const schemaWithoutComments = rawSchema
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*--.*$/gm, '');

    const cleanedStatements = schemaWithoutComments
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => {
        if (!stmt || stmt.length < 5) return false;
        const upper = stmt.toUpperCase();
        if (upper.startsWith('CREATE DATABASE') || /^USE\s+/i.test(upper)) return false;
        return true;
      });

    logger.info('MigrationService', `Menjalankan ${cleanedStatements.length} statement DDL/DML pada database [${dbInfo.database}]...`);

    let executedCount = 0;
    for (const sql of cleanedStatements) {
      await pool.query(sql);
      executedCount++;
    }

    // 2. Buat tabel riwayat migrasi setelah seluruh statement schema berhasil.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migration_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        migration_name VARCHAR(120) NOT NULL UNIQUE,
        batch INT NOT NULL DEFAULT 1,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Verifikasi seluruh tabel aplikasi, bukan hanya beberapa tabel contoh.
    const requiredTables = [
      'admins', 'school_profile', 'school_history', 'school_vision_mission',
      'school_organization', 'teachers', 'staff', 'news_categories', 'news',
      'gallery_albums', 'gallery_media', 'achievements', 'facilities',
      'ppdb_information', 'contact_messages', 'website_settings',
      'visitor_sessions', 'visitor_pageviews', 'admin_activities',
      'uploaded_files', 'agendas', 'programs', 'migration_history'
    ];
    const [rows]: any = await pool.query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = ? AND table_name IN (${requiredTables.map(() => '?').join(', ')})`,
      [dbInfo.database, ...requiredTables]
    );
    const foundTables = new Set((rows as any[]).map(r => String(r.table_name || r.TABLE_NAME).toLowerCase()));
    const missingTables = requiredTables.filter(name => !foundTables.has(name));

    if (missingTables.length > 0) {
      throw new Error(`Verifikasi skema gagal. Tabel wajib belum tersedia: ${missingTables.join(', ')}`);
    }

    // Catat migrasi hanya setelah semua tabel wajib benar-benar tersedia.
    await pool.query(
      `INSERT INTO migration_history (migration_name, batch)
       VALUES ('001_core_schema_and_visitor_sessions', 1)
       ON DUPLICATE KEY UPDATE executed_at = CURRENT_TIMESTAMP`
    );

    logger.info('MigrationService', `Verifikasi seluruh ${requiredTables.length} tabel berhasil pada database [${dbInfo.database}].`);

    return {
      success: true,
      message: `Migrasi selesai. ${executedCount} statement berhasil dieksekusi dan ${requiredTables.length} tabel terverifikasi.`
    };
  } catch (err: any) {
    const errorMsg = `Gagal menjalankan migrasi database [${dbInfo.database}]: ${err.message}`;
    logger.error('MigrationService', errorMsg, { code: err.code, sqlState: err.sqlState });
    return { success: false, message: errorMsg, details: err };
  }
}

// Eksekusi langsung jika dipanggil via CLI
if (process.argv[1] && process.argv[1].endsWith('migrate.ts')) {
  runMigrations().then((res) => {
    if (!res.success) {
      process.exit(1);
    }
    process.exit(0);
  });
}
