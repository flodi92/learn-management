import Database from 'better-sqlite3';
import { SaveData, SaveDataBase, TimedResult } from '../../model';

type ResultRow = Omit<TimedResult, 'wasConfusedWith'> & {
  wasConfusedWith: string | null;
};

export class SQLiteDataBase implements SaveDataBase {
  private db: Database.Database;

  constructor(path = 'regExp.sqlite') {
    this.db = new Database(path);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS results (
        id TEXT NOT NULL,
        correctness REAL NOT NULL,
        day INTEGER NOT NULL,
        wasConfusedWith TEXT
      )
    `);
    const columns = this.db
      .prepare('PRAGMA table_info(results)')
      .all() as unknown as { name: string }[];
    if (!columns.some(({ name }) => name === 'wasConfusedWith')) {
      this.db.exec('ALTER TABLE results ADD COLUMN wasConfusedWith TEXT');
    }
  }

  loadSaveData(): SaveData {
    const rows = this.db
      .prepare(
        'SELECT id, correctness, day, wasConfusedWith FROM results ORDER BY day, rowid',
      )
      .all() as unknown as ResultRow[];
    return rows.map(({ wasConfusedWith, ...result }) =>
      wasConfusedWith === null
        ? result
        : { ...result, wasConfusedWith: JSON.parse(wasConfusedWith) },
    );
  }

  saveData(saveData: SaveData): void {
    const insert = this.db.prepare(
      'INSERT INTO results (id, correctness, day, wasConfusedWith) VALUES (?, ?, ?, ?)',
    );
    this.db.exec('BEGIN');
    try {
      this.db.exec('DELETE FROM results');
      for (const { id, correctness, day, wasConfusedWith } of saveData) {
        insert.run(
          id,
          correctness,
          day,
          wasConfusedWith === undefined
            ? null
            : JSON.stringify(wasConfusedWith),
        );
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
