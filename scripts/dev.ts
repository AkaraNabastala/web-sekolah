import { spawn, type ChildProcess } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(rootDir, '.env') });

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children: ChildProcess[] = [];

function startService(label: string, directory: string) {
  const child = spawn(npmCommand, ['run', 'dev'], {
    cwd: path.join(rootDir, directory),
    stdio: 'inherit',
    env: process.env
  });
  children.push(child);
  child.on('error', error => {
    console.error(`[${label}] Gagal dijalankan: ${error.message}`);
    stopAll(1);
  });
  child.on('exit', code => {
    if (code && code !== 0) {
      console.error(`[${label}] Berhenti dengan kode ${code}`);
      stopAll(code);
    }
  });
}

let stopping = false;
function stopAll(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  process.exitCode = exitCode;
}

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));

console.log('Menjalankan backend (port 5000) dan frontend Vite (port 5173)...');
startService('BACKEND', 'backend');
startService('FRONTEND', 'frontend');
