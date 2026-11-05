import { describe, expect, it } from 'vitest';
import { OverviewSubjectStatisticsItem } from '../overview.model';
import { computeAggregatedStatistics } from './overview.computeAggregatedStatistics';

const createItem = (id: string): OverviewSubjectStatisticsItem => ({
  id,
  label: id,
  mastery: 0.5,
  lastRepetitionBeforeDays: 1,
  numberOfRepetitions: 1,
  learningState: 'learning',
  lastMastery: 0.5,
  lastCorrectness: 0.5,
});

const items = ['a', 'b', 'c'].map(createItem);

describe('computeAggregatedStatistics', () => {
  it.each([
    [[], undefined, 'implicitNoSelection'],
    [['a'], undefined, 'implicitSelection'],
    [['a', 'b', 'c'], undefined, 'implicitFullSelection'],
    [[], true, 'explicitSelectionUnselections'],
    [['a'], true, 'explicitSelectionUnselections'],
    [['a', 'b', 'c'], true, 'explicitSelection'],
    [[], false, 'explicitUnselection'],
  ] as const)(
    'derives the selection state from selected ids %j and group selection %s as %s',
    (selectedIds, groupSelection, selectionState) => {
      expect(
        computeAggregatedStatistics(items, [...selectedIds], groupSelection)
          .selectionState,
      ).toBe(selectionState);
    },
  );

  it('counts only the selected ids that belong to the items', () => {
    const statistics = computeAggregatedStatistics(
      items,
      ['a', 'other'],
      undefined,
    );
    expect(statistics.selected).toBe(1);
    expect(statistics.selectionState).toBe('implicitSelection');
  });
});
