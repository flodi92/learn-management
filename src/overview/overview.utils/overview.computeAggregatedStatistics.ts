import {
  OverviewAggregatedStatisticsItem,
  OverviewTaskDescriptionStatisticsItem,
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
  statisticsItems: OverviewTaskDescriptionStatisticsItem[],
  selectedIds: string[],
  groupSelection: boolean | undefined,
): OverviewAggregatedStatisticsItem => {
  const selected = statisticsItems.filter((item) =>
    selectedIds.includes(item.id),
  ).length;

  const trainedBefore = statisticsItems
    .map((item) => item.lastRepetitionBefore)
    .filter(Number.isFinite);
  const lastRepetitionBefore = trainedBefore.length
    ? Math.min(...trainedBefore)
    : undefined;

  return {
    lastRepetitionBefore,
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
