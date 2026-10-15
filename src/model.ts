export interface LearnSubject {
  id: string;
  parentIds?: string[];
  categories?: string[];
  relevance?: number;
}

export interface SubjectStatisticsItem {
  mastery: number;
  lastRepetition?: number;
  lastMastery: number;
  lastCorrectness: number;
}

export type SubjectStatistics = Record<string, SubjectStatisticsItem>;

export type LearningState = 'notLearned' | 'learning' | 'learned' | 'forRepeat';

export type CategoryAndRelevanceStatisticsItem = {
  category: string;
  relevance: number;
  all: number;
} & Record<Exclude<LearningState, 'forRepeat'>, number>; // @todo no Exclude

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
  time: number;
}

export type SaveData = TimedResult[];
