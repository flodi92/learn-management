import { LearningState, SubjectStatisticsItem } from '../model';
import {
  GroupTypeOrSubject,
  OverviewRecursiveUndeterminedStatistics,
} from './overview.utils/overview.computeStatistics.model';

export interface OverviewSubjectStatisticsItem extends Omit<
  SubjectStatisticsItem,
  'lastRepetition'
> {
  id: string;
  label: string;
  lastRepetitionBeforeDays: number;
  learningState: LearningState;
}

export type SelectionState =
  | 'implicitNoSelection'
  | 'implicitSelection'
  | 'implicitFullSelection'
  | 'explicitSelectionUnselections'
  | 'explicitSelection'
  | 'explicitUnselection';

export type OverviewAggregatedStatisticsItem = {
  avgLastRepetitionBeforeDays: number;
  selected: number;
  selectionState: SelectionState;
} & Record<LearningState, number>;

export type OverviewStatistics =
  OverviewSubjectStatisticsItem | OverviewAggregatedStatisticsItem;

export type OverviewRecursiveStatistics =
  OverviewRecursiveUndeterminedStatistics<
    OverviewStatistics,
    GroupTypeOrSubject<RelevanceCategoryGroupType>
  >;

export type RelevanceCategoryGroupType = 'relevance' | 'category';

export type OverviewGroupTypeOrSubject =
  GroupTypeOrSubject<RelevanceCategoryGroupType>;

export type OverviewSelectionPath = [
  OverviewGroupTypeOrSubject,
  string | number,
][];

export type OverviewSelectionKey =
  `[["${OverviewGroupTypeOrSubject}",${string}`;

export type OverviewGroupSelection = Partial<
  Record<OverviewSelectionKey, boolean>
>;

export type OverviewSubjectSelection = Partial<Record<string, true>>;

export type DisplayComputedStatistics = (
  statistics: OverviewRecursiveStatistics,
  toggleSelection: (path: OverviewSelectionPath) => void,
  subjectSelection: () => OverviewSubjectSelection,
) => Promise<void>;

export type CreateComputedStatistics = (
  getSelectedIds: () => string[],
  getGroupSelection: () => OverviewGroupSelection,
) => OverviewRecursiveStatistics;
