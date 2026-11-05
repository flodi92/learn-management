import { LearningState, SubjectStatisticsItem } from '../model';
import {
  GroupTypeOrSubject,
  OverviewRecursiveUndeterminedStatistics,
} from './overview.utils/overview.computeStatistics.model';

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
  OverviewRecursiveUndeterminedStatistics<
    OverviewSubjectStatisticsItem | OverviewAggregatedStatisticsItem,
    GroupTypeOrSubject<RelevanceCategoryGroupType>
  >;

export type RelevanceCategoryGroupType = 'relevance' | 'category';

export type DisplayComputedStatistics = (
  statistics: OverviewRecursiveStatistics,
  toggleSelection: (path: [string, string | number][]) => void,
  groupSelection: () => Record<string, boolean | undefined>,
  subjectSelection: () => Record<string, true | undefined>,
  numberOfSelectedItems: () => number,
) => Promise<void>;
