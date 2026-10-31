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
  GroupType extends string = string,
> {
  statistics: Statistics;
  groupType?: GroupType;
  parentGroups?: readonly (readonly [GroupType, string | number])[];
  children?: Record<
    string | number,
    OverviewRecursiveUndeterminedStatistics<Statistics, GroupType>
  >;
}

export type OverviewRecursiveStatistics =
  OverviewRecursiveUndeterminedStatistics<OverviewStatistics>;

export type SubjectStatisticsTuple<
  Subject extends LearnSubject,
  Statistics extends object,
> = [string, Subject, Statistics];

export type SubjectStatisticsTuples<
  Subject extends LearnSubject,
  Statistics extends object,
> = SubjectStatisticsTuple<Subject, Statistics>[];
