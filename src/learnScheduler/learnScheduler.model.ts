import { LearningState, TaskDescriptionStatisticsItem } from '../model';

export interface LearnSchedulerStatisticsItem extends TaskDescriptionStatisticsItem {
  stability?: number;
  isLearnt: boolean;
  isDue: boolean;
  learningState: LearningState;
}

export type LearnSchedulerStatistics = Record<
  string,
  LearnSchedulerStatisticsItem
>;

export interface LearnSchedulerCharacteristics {
  effectiveRelevance?: number;
  effectiveComplexity?: number;
  prerequisiteIds: string[];
  minimumCategoryRelevance?: number;
}

export type LearnSchedulerCharacteristicsMapping = Record<
  string,
  LearnSchedulerCharacteristics
>;
