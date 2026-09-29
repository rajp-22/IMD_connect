/**
 * Utility script to automatically generate static PNG frames for GIF icons
 * Usage: node scripts/generate-static-gifs.js
 * Or: npm run generate-static-gifs
 */

const { spawnSync } = require('child_process');
const path = require('path');

const ps1Path = path.resolve(__dirname, 'generate-static-gifs.ps1');

const result = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', ps1Path], {
  stdio: 'inherit',
});

process.exit(result.status || 0);
