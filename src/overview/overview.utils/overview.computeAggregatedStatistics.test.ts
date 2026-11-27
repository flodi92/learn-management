import { describe, expect, it } from 'vitest';
import { OverviewTaskDescriptionStatisticsItem } from '../overview.model';
import { computeAggregatedStatistics } from './overview.computeAggregatedStatistics';
import { convertDayToTimestamp } from '../../utils';

const createItem = (id: string): OverviewTaskDescriptionStatisticsItem => ({
  id,
  label: id,
  mastery: 0.5,
  lastRepetitionBefore: convertDayToTimestamp(1),
  numberOfRepetitions: 1,
  learningState: 'learning',
  lastMastery: 0.5,
  lastCorrectness: 0.5,
  examinations: [],
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

  it('takes the minimum last repetition of the trained items', () => {
    const trained = [
      { ...createItem('a'), lastRepetitionBefore: convertDayToTimestamp(5) },
      { ...createItem('b'), lastRepetitionBefore: Infinity },
      { ...createItem('c'), lastRepetitionBefore: convertDayToTimestamp(2) },
    ];
    expect(
      computeAggregatedStatistics(trained, [], undefined).lastRepetitionBefore,
    ).toBe(convertDayToTimestamp(2));
  });

  it.each([[[]], [[{ lastRepetitionBefore: Infinity }]]])(
    'leaves the last repetition undefined if no item has been trained',
    (untrained) => {
      const untrainedItems = untrained.map((item) => ({
        ...createItem('a'),
        ...item,
      }));
      expect(
        computeAggregatedStatistics(untrainedItems, [], undefined)
          .lastRepetitionBefore,
      ).toBeUndefined();
    },
  );
});
