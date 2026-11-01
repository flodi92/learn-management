import { LearningState, SubjectStatisticsItem } from '../model';
import { OverviewRecursiveUndeterminedStatistics } from './overview.utils/overview.computeStatistics.model';

export interface OverviewSubjectStatisticsItem extends Omit<
  SubjectStatisticsItem,
  'lastRepetition'
> {
  label: string;
  lastRepetitionBeforeDays: number;
  learningState: LearningState;
}

export type OverviewAggregatedStatisticsItem = {
  avgLastRepetitionBeforeDays: number;
} & Record<LearningState, number>;

export type OverviewStatistics =
  OverviewSubjectStatisticsItem | OverviewAggregatedStatisticsItem;

export type OverviewRecursiveStatistics =
  OverviewRecursiveUndeterminedStatistics<OverviewStatistics>;

export type RelevanceCategoryGroupType = 'relevance' | 'category';
