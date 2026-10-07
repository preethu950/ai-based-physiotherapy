import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { exercises } from './exercises';

const dbPath = process.env.DB_PATH || './data/physioai.db';

const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db: DatabaseType = new Database(dbPath);

export const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      ageRange TEXT,
      goal TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      view TEXT NOT NULL,
      primaryAngle TEXT NOT NULL,
      instructions TEXT NOT NULL,
      commonMistakes TEXT NOT NULL,
      recommendedReps INTEGER NOT NULL,
      hasAnalyzer INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      exerciseId TEXT NOT NULL,
      startedAt TEXT NOT NULL,
      durationSeconds INTEGER NOT NULL,
      totalReps INTEGER NOT NULL,
      correctReps INTEGER NOT NULL,
      incompleteReps INTEGER NOT NULL,
      formScore INTEGER NOT NULL,
      componentScores TEXT NOT NULL,
      reps TEXT NOT NULL,
      feedbackSummary TEXT NOT NULL,
      rangeOfMotion TEXT NOT NULL,
      source TEXT NOT NULL,
      completed INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (exerciseId) REFERENCES exercises(id)
    );
  `);

  // Add createdAt column to existing users tables that might not have it
  try {
    db.exec(`ALTER TABLE users ADD COLUMN createdAt TEXT DEFAULT (datetime('now'))`);
  } catch {
    // Column already exists, ignore
  }

  const stmt = db.prepare('INSERT OR IGNORE INTO exercises (id, name, category, description, view, primaryAngle, instructions, commonMistakes, recommendedReps, hasAnalyzer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  
  exercises.forEach(ex => {
    stmt.run(
      ex.id, ex.name, ex.category, ex.description, ex.view, ex.primaryAngle,
      JSON.stringify(ex.instructions), JSON.stringify(ex.commonMistakes),
      ex.recommendedReps, ex.hasAnalyzer ? 1 : 0
    );
  });
};
