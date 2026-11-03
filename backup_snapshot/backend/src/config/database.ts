import mysql, { Pool, PoolOptions } from 'mysql2/promise';

/**
 * Konfigurasi Koneksi Database MySQL SMP Islam Caruy
 * Mendukung koneksi production MySQL dan deteksi status koneksi real-time.
 */

export const dbConfig: PoolOptions = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smp_islam_caruy',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  connectTimeout: 2000
};

// Buat pool koneksi MySQL
let pool: Pool | null = null;
let isConnected = false;
let lastError: string | null = null;

try {
  pool = mysql.createPool(dbConfig);
} catch (err: any) {
  console.warn('[MySQL Config] Gagal menginisialisasi connection pool MySQL:', err.message);
  lastError = err.message;
}

/**
 * Uji koneksi ke database MySQL.
 * Jika MySQL lokal/server belum aktif, fungsi ini memberikan laporan status tanpa membuat server crash.
 */
export async function testMySQLConnection(): Promise<{ connected: boolean; message: string; host: string; database: string }> {
  if (!pool) {
    return {
      connected: false,
      message: 'Pool MySQL belum diinisialisasi.',
      host: String(dbConfig.host),
      database: String(dbConfig.database)
    };
  }

  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    isConnected = true;
    lastError = null;
    return {
      connected: true,
      message: `Berhasil terhubung ke database MySQL [${dbConfig.database}] pada host ${dbConfig.host}:${dbConfig.port}`,
      host: String(dbConfig.host),
      database: String(dbConfig.database)
    };
  } catch (err: any) {
    isConnected = false;
    lastError = err.message;
    return {
      connected: false,
      message: `Tidak dapat menjangkau server MySQL (${err.code || err.message}). Fallback ke storage engine relasional lokal persisten aktif.`,
      host: String(dbConfig.host),
      database: String(dbConfig.database)
    };
  }
}

export function getMySQLPool(): Pool | null {
  return pool;
}

export function getMySQLStatus() {
  return {
    configured: true,
    connected: isConnected,
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    lastError
  };
}

export default pool;
