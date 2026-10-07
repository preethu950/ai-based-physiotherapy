# Design Decisions

| # | Decision | Reason |
|---|----------|--------|
| 1 | Backend: Node+Express+SQLite instead of Spring Boot | Maven/Gradle not available in environment; spec explicitly sanctions Node+Express+SQLite fallback |
| 2 | SQLite via better-sqlite3 (synchronous) | Zero-setup, no Docker needed, reliable local development |
| 3 | EMA smoothing (α=0.4) over One-Euro filter | Simpler implementation with predictable convergence for rehabilitation movements |
| 4 | Heuristic exercise thresholds in config | Thresholds (e.g. squat depth ≤ 100°, start ≥ 160°) are heuristic software targets, not clinical measurements |
| 5 | JWT with 24h expiry | Appropriate balance between session convenience and security for rehab workout tracking |
| 6 | Recharts for data visualization | Clean integration with React 18, responsive SVG rendering |
| 7 | bcryptjs rounds = 10 | Industry standard secure hashing |
| 8 | Privacy-first pose processing | Video stream processed exclusively client-side; only derived numeric metrics uploaded |
| 9 | Demo mode synthetic stream | Guarantees testability and functional end-to-end sessions when webcam is unavailable or denied |
| 10 | Sequential backend vitest runs (`fileParallelism: false`) | Avoids concurrent lock collisions on local SQLite database during integration tests |
