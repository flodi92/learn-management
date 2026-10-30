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

export interface OverviewRecursiveUndeterminedStatistics<
  Statistics extends object = object,
> {
  statistics: Statistics;
  groupType?: string;
  parentGroups?: readonly (readonly [string, string | number])[];
  children?: Record<
    string | number,
    OverviewRecursiveUndeterminedStatistics<Statistics>
  >;
}

export type OverviewRecursiveStatistics =
  OverviewRecursiveUndeterminedStatistics<OverviewStatistics>;

export type SubjectStatisticsTuple<S extends LearnSubject> = [
  string,
  S,
  OverviewSubjectStatisticsItem,
];

export type SubjectStatisticsTuples<S extends LearnSubject> =
  SubjectStatisticsTuple<S>[];
