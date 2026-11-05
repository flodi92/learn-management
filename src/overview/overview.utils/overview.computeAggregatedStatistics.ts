import {
  OverviewSubjectStatisticsItem,
  OverviewAggregatedStatisticsItem,
  SelectionState,
} from '../overview.model';

const determineSelectionState = (
  numberOfItems: number,
  numberOfSelectedItems: number,
  groupSelection: boolean | undefined,
): SelectionState => {
  if (groupSelection === false) return 'explicitUnselection';
  if (numberOfSelectedItems === 0) {
    return groupSelection === true
      ? 'explicitSelectionUnselections'
      : 'implicitNoSelection';
  }
  if (numberOfSelectedItems < numberOfItems) {
    return groupSelection === true
      ? 'explicitSelectionUnselections'
      : 'implicitSelection';
  }
  return groupSelection === true
    ? 'explicitSelection'
    : 'implicitFullSelection';
};

export const computeAggregatedStatistics = (
  statisticsItems: OverviewSubjectStatisticsItem[],
  selectedIds: string[],
  groupSelection: boolean | undefined,
): OverviewAggregatedStatisticsItem => {
  const selected = statisticsItems.filter((item) =>
    selectedIds.includes(item.id),
  ).length;

  return {
    avgLastRepetitionBeforeDays: statisticsItems.reduce(
      (acc, item) => acc + item.lastRepetitionBeforeDays,
      0,
    ),
    selected,
    selectionState: determineSelectionState(
      statisticsItems.length,
      selected,
      groupSelection,
    ),
    notLearned: statisticsItems.filter(
      (item) => item.learningState === 'notLearned',
    ).length,
    learning: statisticsItems.filter(
      (item) => item.learningState === 'learning',
    ).length,
    learned: statisticsItems.filter((item) => item.learningState === 'learned')
      .length,
    forRepeat: statisticsItems.filter(
      (item) => item.learningState === 'forRepeat',
    ).length,
  };
};
