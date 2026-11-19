import { describe, expect, it } from 'vitest';
import {
  OverviewAggregatedStatisticsItem,
  OverviewRecursiveStatistics,
  OverviewSelectionPath,
} from '../overview.model';
import { displaySelectableComputedStatistics } from './overview.displaySelectableComputedStatistics';

const taskDescriptionStatistics: OverviewAggregatedStatisticsItem = {
  avgLastRepetitionBeforeDays: 1,
  selected: 0,
  selectionState: 'implicitNoSelection',
  notLearned: 0,
  learning: 0,
  learned: 0,
  forRepeat: 0,
};

const statistics: OverviewRecursiveStatistics = {
  groupType: 'category',
  statistics: taskDescriptionStatistics,
  children: {
    Fractions: {
      groupType: 'taskDescription',
      statistics: taskDescriptionStatistics,
    },
  },
  getChildrenIds: () => ['Fractions'],
};

const taskDescriptionPath: OverviewSelectionPath = [
  ['taskDescription', 'Fractions'],
];

const selectAfterToggles = (
  toggles: number,
  preselectedTaskDescriptionIds: string[] = [],
) =>
  displaySelectableComputedStatistics(
    async (_statistics, toggleSelection) => {
      Array.from({ length: toggles }).forEach(() =>
        toggleSelection(taskDescriptionPath),
      );
    },
    () => statistics,
    preselectedTaskDescriptionIds,
  );

describe('OverviewDisplaySelectableComputedStatistics taskDescription toggling', () => {
  it('selects an unselected taskDescription on the first toggle', async () => {
    expect(await selectAfterToggles(1)).toEqual(['Fractions']);
  });

  it('deselects a taskDescription on the second toggle', async () => {
    expect(await selectAfterToggles(2)).toEqual([]);
  });

  it('alternates between selected and unselected without an explicit false state', async () => {
    expect(await selectAfterToggles(3)).toEqual(['Fractions']);
  });

  it('deselects a preselected taskDescription on the first toggle', async () => {
    expect(await selectAfterToggles(1, ['Fractions'])).toEqual([]);
  });
});
