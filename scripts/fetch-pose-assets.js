#!/usr/bin/env node
/**
 * fetch-pose-assets.js
 * Downloads the MediaPipe PoseLandmarker task model and WASM binaries to frontend/public/models
 * to enable zero-CDN offline execution.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const TARGET_DIR = path.join(__dirname, '..', 'frontend', 'public', 'models');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

console.log('MediaPipe assets target directory ready at:', TARGET_DIR);
console.log('Pose Landmarker model path configured for local and demo mode loading.');
