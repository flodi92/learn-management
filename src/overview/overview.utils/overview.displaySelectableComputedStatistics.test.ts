import { describe, expect, it } from 'vitest';
import {
  OverviewAggregatedStatisticsItem,
  OverviewRecursiveStatistics,
  OverviewSelectionPath,
} from '../overview.model';
import { toRecursiveStatistics } from './overview.toRecursiveStatistics';
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
  ...toRecursiveStatistics({
    defaultGroupType: 'category',
    statistics: taskDescriptionStatistics,
    children: {
      Fractions: {
        defaultGroupType: 'taskDescription',
        statistics: taskDescriptionStatistics,
      },
    },
  }),
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

describe('OverviewDisplaySelectableComputedStatistics group toggling', () => {
  const idsOfPaths: Record<string, string[]> = {
    [JSON.stringify([['category', 'characterClass']])]: ['a', 'b'],
    [JSON.stringify([['relevance', '2']])]: ['a', 'b'],
    [JSON.stringify([['relevance', '1']])]: ['c'],
    [JSON.stringify([
      ['relevance', '2'],
      ['category', 'characterClass'],
    ])]: ['a', 'b'],
  };
  const groupStatistics: OverviewRecursiveStatistics = {
    statistics: taskDescriptionStatistics,
    getChildren: () => undefined,
    getChildrenIds: (path) => idsOfPaths[JSON.stringify(path)],
  };

  const selectAfter = (paths: OverviewSelectionPath[], preselected: string[]) =>
    displaySelectableComputedStatistics(
      async (_statistics, toggleSelection) => {
        paths.forEach((path) => toggleSelection(path));
      },
      () => groupStatistics,
      preselected,
    );

  const category: OverviewSelectionPath = [['category', 'characterClass']];
  const relevance: OverviewSelectionPath = [['relevance', '2']];

  it('lets a later selection of a group win over an earlier unselection of an overlapping group', async () => {
    expect(await selectAfter([category, category, relevance], [])).toEqual([
      'a',
      'b',
    ]);
  });

  it('lets a later unselection of a group win over an earlier selection of an overlapping group', async () => {
    expect(await selectAfter([relevance, category, category], [])).toEqual([]);
  });

  it('unselects preselected taskDescriptions with a later group unselection', async () => {
    expect(await selectAfter([relevance, relevance], ['a', 'c'])).toEqual([
      'c',
    ]);
  });

  it('resolves a group selection the same way for paths with and without default parent groups', async () => {
    const nested: OverviewSelectionPath = [
      ['relevance', '2'],
      ['category', 'characterClass'],
    ];
    expect(await selectAfter([nested], [])).toEqual(['a', 'b']);
    expect(await selectAfter([category], [])).toEqual(['a', 'b']);
  });
});
