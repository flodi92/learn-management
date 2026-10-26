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

export interface OverviewRecursiveStatistics {
  statistics: OverviewSubjectStatisticsItem | OverviewAggregatedStatisticsItem;
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

export type Line = {
  depth: number;
  text: string;
  path?: string[];
};
