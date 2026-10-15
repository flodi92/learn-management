import Database from 'better-sqlite3';
import { SaveData, SaveDataBase, TimedResult } from '../../model';

export class RegExpDataBase implements SaveDataBase {
  private db: Database.Database;

  constructor(path = 'regExp.sqlite') {
    this.db = new Database(path);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS results (
        id TEXT NOT NULL,
        correctness REAL NOT NULL,
        day INTEGER NOT NULL
      )
    `);
  }

  loadSaveData(): SaveData {
    return this.db
      .prepare('SELECT id, correctness, day FROM results ORDER BY day, rowid')
      .all() as unknown as TimedResult[];
  }

  saveData(saveData: SaveData): void {
    const insert = this.db.prepare(
      'INSERT INTO results (id, correctness, day) VALUES (?, ?, ?)',
    );
    this.db.exec('BEGIN');
    try {
      this.db.exec('DELETE FROM results');
      for (const { id, correctness, day } of saveData) {
        insert.run(id, correctness, day);
      }
      this.db.exec('COMMIT');
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }

  close(): void {
    this.db.close();
  }
}
