import Database from 'better-sqlite3';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SQLiteDataBase } from './sqlite.dataBase';

describe('SQLiteDataBase', () => {
  it('saves and loads results with and without wasConfusedWith', () => {
    const dataBase = new SQLiteDataBase(':memory:');
    const saveData = [
      { id: 'a', timestamp: 1, correctness: 1 },
      {
        id: 'b',
        timestamp: 2,
        correctness: 0,
        wasConfusedWith: ['c', 'd'],
      },
    ];
    dataBase.saveData(saveData);
    expect(dataBase.loadSaveData()).toStrictEqual(saveData);
    dataBase.close();
  });

  it('adds the wasConfusedWith column to an existing results table', () => {
    const directory = mkdtempSync(join(tmpdir(), 'sqlite-dataBase-'));
    try {
      const path = join(directory, 'results.sqlite');
      const legacy = new Database(path);
      legacy.exec(
        'CREATE TABLE results (id TEXT NOT NULL, correctness REAL NOT NULL, timestamp INTEGER NOT NULL)',
      );
      legacy.exec("INSERT INTO results VALUES ('a', 1, 1)");
      legacy.close();

      const dataBase = new SQLiteDataBase(path);
      expect(dataBase.loadSaveData()).toStrictEqual([
        { id: 'a', timestamp: 1, correctness: 1 },
      ]);
      dataBase.close();
    } finally {
      rmSync(directory, { recursive: true });
    }
  });
});
