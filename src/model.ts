export interface Task {
  taskDescriptionId: string;
}

export interface TaskDescription {
  id: string;
  parents?: string[];
  confusedWith?: string[];
  equalTo?: string[];
  subjects?: string[];
  categories?: string[];
  relevance?: number;
  complexity?: number;
}
export interface TaskDescriptionStatisticsItem {
  mastery: number;
  lastRepetition?: number;
  lastMastery?: number;
  lastCorrectness?: number;
  numberOfRepetitions: number;
}

export type TaskDescriptionStatistics = Record<
  string,
  TaskDescriptionStatisticsItem
>;

export const learningStates = [
  'notLearned',
  'learning',
  'learned',
  'forRepeat',
] as const;

export type LearningState = (typeof learningStates)[number];

export type CategoryAndRelevanceStatisticsItem = {
  category: string;
  relevance: number;
  all: number;
} & Record<LearningState, number>;
export type CategoryAndRelevanceStatistics = Record<
  CategoryAndRelevanceStatisticsItem['category'],
  Record<
    CategoryAndRelevanceStatisticsItem['relevance'],
    CategoryAndRelevanceStatisticsItem
  >
>;

export interface SaveDataBase {
  loadSaveData(): SaveData;
  saveData(saveData: SaveData): void;
}

export interface Result {
  id: string;
  correctness: number;
}

export interface TimedResult extends Result {
  day: number;
}

export type SaveData = TimedResult[];
