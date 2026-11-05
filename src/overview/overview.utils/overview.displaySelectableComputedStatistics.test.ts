import { describe, expect, it } from 'vitest';
import {
  OverviewRecursiveStatistics,
  OverviewSelectionPath,
} from '../overview.model';
import { displaySelectableComputedStatistics } from './overview.displaySelectableComputedStatistics';

const subjectStatistics = {
  avgLastRepetitionBeforeDays: 1,
  notLearned: 0,
  learning: 0,
  learned: 0,
  forRepeat: 0,
};

const statistics: OverviewRecursiveStatistics = {
  groupType: 'category',
  statistics: subjectStatistics,
  children: {
    Fractions: { groupType: 'subject', statistics: subjectStatistics },
  },
  getChildrenIds: () => ['Fractions'],
};

const subjectPath: OverviewSelectionPath = [['subject', 'Fractions']];

const selectAfterToggles = (
  toggles: number,
  preselectedSubjectIds: string[] = [],
) =>
  displaySelectableComputedStatistics(
    async (_statistics, toggleSelection) => {
      Array.from({ length: toggles }).forEach(() =>
        toggleSelection(subjectPath),
      );
    },
    statistics,
    preselectedSubjectIds,
  );

describe('OverviewDisplaySelectableComputedStatistics subject toggling', () => {
  it('selects an unselected subject on the first toggle', async () => {
    expect(await selectAfterToggles(1)).toEqual(['Fractions']);
  });

  it('deselects a subject on the second toggle', async () => {
    expect(await selectAfterToggles(2)).toEqual([]);
  });

  it('alternates between selected and unselected without an explicit false state', async () => {
    expect(await selectAfterToggles(3)).toEqual(['Fractions']);
  });

  it('deselects a preselected subject on the first toggle', async () => {
    expect(await selectAfterToggles(1, ['Fractions'])).toEqual([]);
  });
});
