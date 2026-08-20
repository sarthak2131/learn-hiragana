import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const safeEsbuildDir = path.join(
  'C:\\Users\\Sarthak\\.codex\\visualizations\\2026\\08\\20\\01a01fb3-0278-7670-a933-ce8f7d8ac738',
  'esbuild-runtime'
);
const safeEsbuildBinary = path.join(safeEsbuildDir, 'esbuild.exe');
const bundledEsbuildBinary = path.join(__dirname, 'node_modules', '@esbuild', 'win32-x64', 'esbuild.exe');

try {
  fs.mkdirSync(safeEsbuildDir, { recursive: true });
  if (!fs.existsSync(safeEsbuildBinary)) {
    fs.copyFileSync(bundledEsbuildBinary, safeEsbuildBinary);
  }
  process.env.ESBUILD_BINARY_PATH = safeEsbuildBinary;
} catch (error) {
  console.error('Failed to prepare esbuild binary:', error);
}

const viteEntry = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
const child = spawn(process.execPath, [viteEntry, 'build', '--configLoader', 'native'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: process.env,
});

child.on('error', (error) => {
  console.error('Error starting build:', error);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
