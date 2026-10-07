# Environment Report

## System
- **OS:** Windows
- **Date:** 2026-10-06

## Available Tools

| Tool | Version | Status |
|------|---------|--------|
| Node.js | v20.16.0 | ✅ Available |
| npm | 10.8.1 | ✅ Available |
| npx | 10.8.1 | ✅ Available |
| Java | 23 | ✅ Available |
| Maven | — | ❌ Not installed |
| Gradle | — | ❌ Not installed |
| Git | 2.54.0 | ✅ Available |
| Docker | — | ❌ Not installed |
| Python | 3.12.4 | ✅ Available |

## Network
- npm registry: ✅ Accessible (PONG ~6.5s)
- Package downloads: ✅ Working

## Impact on Stack
- **Backend:** Using Node.js + Express + SQLite fallback (Maven/Gradle unavailable)
- **Database:** SQLite as zero-setup default (Docker unavailable for PostgreSQL)
- **Pose assets:** Downloading MediaPipe WASM/model files via script
