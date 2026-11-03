import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

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
  connectTimeout: 4000
};

let pool: Pool | null = null;
let isConnected = false;
let lastError: string | null = null;

try {
  pool = mysql.createPool(dbConfig);
} catch (err: any) {
  console.error('[MySQL Init Error]', err.message);
  lastError = err.message;
}

export async function checkConnection(): Promise<{ connected: boolean; message: string }> {
  if (!pool) {
    return { connected: false, message: 'MySQL Pool is null' };
  }
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    isConnected = true;
    lastError = null;
    return {
      connected: true,
      message: `Terhubung ke MySQL [${dbConfig.database}] pada ${dbConfig.host}:${dbConfig.port}`
    };
  } catch (err: any) {
    isConnected = false;
    lastError = err.message;
    return {
      connected: false,
      message: `Gagal terhubung ke MySQL (${err.code || err.message}).`
    };
  }
}

export function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

export function getStatus() {
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
