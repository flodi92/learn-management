import { LearningState, LearnSubject, SubjectStatisticsItem } from '../model';

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

export interface OverviewRecursiveStatistics {
  statistics: OverviewStatistics;
  childType?: string;
  children?: Record<string | number, OverviewRecursiveStatistics>;
}

export type SubjectStatisticsTuple<S extends LearnSubject> = [
  string,
  S,
  OverviewSubjectStatisticsItem,
];

export type SubjectStatisticsTuples<S extends LearnSubject> =
  SubjectStatisticsTuple<S>[];
