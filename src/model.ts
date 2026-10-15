export interface LearnSubject {
  id: string;
  parentIds?: string[];
  categories?: string[];
  relevance?: number;
}

export interface SaveDataBase {
  loadSaveData(): SaveData;
  saveData(saveData: SaveData): void;
}

export interface Result {
  id: string;
  correctness: number;
}

export interface TimedResult extends Result {
  time: number;
}

export type SaveData = TimedResult[];
