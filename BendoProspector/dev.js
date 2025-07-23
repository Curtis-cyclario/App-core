#!/usr/bin/env node
const { spawn } = require('child_process');

console.log('Starting Bendigo 3D Underground Explorer - Python Backend');
console.log('Geological data processing: NumPy + Flask');
console.log('Access at: http://localhost:5000');

const python = spawn('python3', ['app/main.py'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

python.on('close', (code) => {
  if (code !== 0) {
    console.log(`Python backend exited with code ${code}`);
    process.exit(code);
  }
});

python.on('error', (err) => {
  console.error('Failed to start Python backend:', err);
  process.exit(1);
});

// Keep the process alive
process.on('SIGINT', () => {
  python.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  python.kill('SIGTERM');
  process.exit(0);
});

// Keep the process alive
process.on('SIGINT', () => {
  python.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  python.kill('SIGTERM');
  process.exit(0);
});