import { getPool, checkConnection, getStatus } from '../config/database.js';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
/**
 * Script Migrasi Database MySQL
 * Menjamin seluruh skema tabel yang dibutuhkan sistem dibuat pada database yang sedang aktif
 * secara idempotent (IF NOT EXISTS), tanpa ketergantungan pada perintah 'USE database_lain'.
 */
export async function runMigrations() {
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
        const schemaPath = path.resolve(process.cwd(), 'database', 'schema.sql');
        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Berkas schema.sql tidak ditemukan pada path: ${schemaPath}`);
        }
        const rawSchema = fs.readFileSync(schemaPath, 'utf8');
        // Filter baris yang memuat instruksi 'CREATE DATABASE' atau 'USE' agar migrasi selalu menggunakan database koneksi aktif
        const cleanedStatements = rawSchema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => {
            if (!stmt || stmt.length < 5)
                return false;
            if (stmt.startsWith('--') || stmt.startsWith('/*'))
                return false;
            const upper = stmt.toUpperCase();
            if (upper.startsWith('CREATE DATABASE') || upper.startsWith('USE '))
                return false;
            return true;
        });
        logger.info('MigrationService', `Menjalankan ${cleanedStatements.length} statement DDL/DML pada database [${dbInfo.database}]...`);
        let executedCount = 0;
        for (const sql of cleanedStatements) {
            await pool.query(sql);
            executedCount++;
        }
        // 2. Buat tabel pencatatan riwayat migrasi (idempotent)
        await pool.query(`
      CREATE TABLE IF NOT EXISTS migration_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        migration_name VARCHAR(120) NOT NULL UNIQUE,
        batch INT NOT NULL DEFAULT 1,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
        // Catat batch migrasi
        await pool.query(`
      INSERT INTO migration_history (migration_name, batch)
      VALUES ('001_core_schema_and_visitor_sessions', 1)
      ON DUPLICATE KEY UPDATE executed_at = CURRENT_TIMESTAMP
    `);
        // 3. Verifikasi ketersediaan tabel vital
        const [rows] = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ? 
      AND table_name IN ('visitor_sessions', 'visitor_pageviews', 'migration_history', 'admins', 'school_profile')
    `, [dbInfo.database]);
        const foundTables = rows.map(r => r.table_name || r.TABLE_NAME);
        logger.info('MigrationService', `✅ Verifikasi tabel berhasil. Ditemukan tabel: ${foundTables.join(', ')} pada database [${dbInfo.database}].`);
        return {
            success: true,
            message: `Migrasi selesai. ${executedCount} statement berhasil dieksekusi.`
        };
    }
    catch (err) {
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
