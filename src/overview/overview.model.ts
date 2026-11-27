import { LearningState, TaskDescriptionStatisticsItem } from '../model';
import {
  GroupTypeOrTaskDescription,
  OverviewRecursiveUndeterminedStatistics,
} from './overview.utils/overview.computeStatistics.model';

export interface OverviewExamination {
  examinedBeforeDays: number;
  correctness: number;
  // The labels of the taskDescriptions, not their ids.
  wasConfusedWith: string[];
}

export interface OverviewTaskDescriptionStatisticsItem extends Omit<
  TaskDescriptionStatisticsItem,
  'lastRepetition'
> {
  id: string;
  label: string;
  lastRepetitionBeforeDays: number;
  learningState: LearningState;
  // All examinations counted in numberOfRepetitions, the most recent first.
  examinations: OverviewExamination[];
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
  OverviewTaskDescriptionStatisticsItem | OverviewAggregatedStatisticsItem;

export type OverviewRecursiveStatistics =
  OverviewRecursiveUndeterminedStatistics<
    OverviewStatistics,
    GroupTypeOrTaskDescription<OverviewGroupType>
  >;

export type OverviewGroupType =
  'relevance' | 'category' | 'learningState' | 'selectionState';

export type OverviewGroupTypeOrTaskDescription =
  GroupTypeOrTaskDescription<OverviewGroupType>;

export type OverviewSelectionPath = [
  OverviewGroupTypeOrTaskDescription,
  string | number,
][];

export type OverviewSelectionKey =
  `[["${OverviewGroupTypeOrTaskDescription}",${string}`;

export type OverviewGroupSelection = Partial<
  Record<OverviewSelectionKey, boolean>
>;

export type OverviewTaskDescriptionSelection = Partial<Record<string, true>>;

export type DisplayComputedStatistics = (
  statistics: OverviewRecursiveStatistics,
  toggleSelection: (path: OverviewSelectionPath) => void,
  taskDescriptionSelection: () => OverviewTaskDescriptionSelection,
) => Promise<void>;

export type CreateComputedStatistics = (
  getSelectedIds: () => string[],
  getGroupSelection: () => OverviewGroupSelection,
) => OverviewRecursiveStatistics;
