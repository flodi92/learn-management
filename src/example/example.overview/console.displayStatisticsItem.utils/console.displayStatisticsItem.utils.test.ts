import chalk from 'chalk';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  OverviewAggregatedStatisticsItem,
  OverviewRecursiveStatistics,
  OverviewSubjectStatisticsItem,
  SelectionState,
} from '../../../overview/overview.model';
import {
  learningStateColors,
  selectedColor,
  selectionHighlightColor,
  unfocusedSelectionColor,
} from '../console.constants';
import {
  camelCaseToWords,
  formatStatistics,
  isOverviewSubjectStatisticsItem,
} from './console.formatStatistics';
import { getStatisticsColor } from './console.getStatisticsColor';
import { sortChildren } from './console.sortChildren';

beforeAll(() => {
  chalk.level = 1;
});

const aggregated: OverviewAggregatedStatisticsItem = {
  avgLastRepetitionBeforeDays: 19,
  selected: 3,
  selectionState: 'implicitSelection',
  notLearned: 6,
  learning: 5,
  learned: 9,
  forRepeat: 4,
};

const subject: OverviewSubjectStatisticsItem = {
  id: 'Fractions',
  label: 'Fractions',
  mastery: 0.95,
  lastRepetitionBeforeDays: 2,
  numberOfRepetitions: 5,
  learningState: 'forRepeat',
  lastMastery: 0.5,
  lastCorrectness: undefined,
};

describe('camelCaseToWords', () => {
  it('separates the words of a camel case text', () => {
    expect(camelCaseToWords('notLearned')).toBe('not learned');
    expect(camelCaseToWords('lastRepetitionBeforeDays')).toBe(
      'last repetition before days',
    );
    expect(camelCaseToWords('mastery')).toBe('mastery');
  });
});

describe('isOverviewSubjectStatisticsItem', () => {
  it('distinguishes subject from aggregated statistics', () => {
    expect(isOverviewSubjectStatisticsItem(subject)).toBe(true);
    expect(isOverviewSubjectStatisticsItem(aggregated)).toBe(false);
  });
});

describe('formatStatistics', () => {
  const { notLearned, learning, learned, forRepeat } = learningStateColors;
  const unfocusedSelection = (text: string) => unfocusedSelectionColor(text);

  const selected = (): string => selectedColor('3');

  it('shows only the colored numbers of aggregated statistics, the average last', () => {
    expect(formatStatistics(aggregated, false)).toBe(
      `${unfocusedSelection('[*]')} ${selected()} ${notLearned('6')} ${learning('5')} ${learned('9')} ${forRepeat('4')} ⌀ 19 days before`,
    );
  });

  it('adds the labels to aggregated statistics when focused, leaving them uncolored', () => {
    expect(formatStatistics(aggregated, true)).toBe(
      `[*] ${selectedColor('selected: ')}${selected()}, not learned: ${notLearned('6')}, learning: ${learning('5')}, learned: ${learned('9')}, for repeat: ${forRepeat('4')}, ⌀ 19 days before`,
    );
  });

  it('shows "never trained" instead of an infinite average', () => {
    const neverTrained = {
      ...aggregated,
      avgLastRepetitionBeforeDays: Infinity,
    };
    expect(formatStatistics(neverTrained, false)).toBe(
      `${unfocusedSelection('[*]')} ${selected()} ${notLearned('6')} ${learning('5')} ${learned('9')} ${forRepeat('4')} never trained`,
    );
    expect(formatStatistics(neverTrained, true)).toMatch(/, never trained$/);
    expect(formatStatistics(neverTrained, true)).not.toContain('Infinity');
  });

  it.each([
    ['implicitNoSelection', '   ', false],
    ['implicitSelection', '[*]', false],
    ['implicitFullSelection', '[*]', true],
    ['explicitSelectionUnselections', '[+]', false],
    ['explicitSelection', '[+]', true],
    ['explicitUnselection', '[-]', true],
  ] as const)(
    'shows the selection state %s as "%s" (highlighted: %s) when focused',
    (selectionState, text, isHighlighted) => {
      const [indicator] = formatStatistics(
        { ...aggregated, selectionState },
        true,
      ).split(` ${selectedColor('selected: ')}`);
      expect(indicator).toBe(
        isHighlighted ? selectionHighlightColor(text) : text,
      );
    },
  );

  it('colors the selection state text gray when not focused but keeps the highlight', () => {
    const format = (selectionState: SelectionState) =>
      formatStatistics({ ...aggregated, selectionState }, false).split(' ')[0];
    expect(format('explicitSelection')).toBe(
      unfocusedSelectionColor(selectionHighlightColor('[+]')),
    );
    expect(format('explicitSelectionUnselections')).toBe(
      unfocusedSelectionColor('[+]'),
    );
  });

  it('shows only the colored mastery of a subject when not focused', () => {
    expect(formatStatistics(subject, false)).toBe(forRepeat('95%'));
  });

  it('shows learning state, mastery and repetitions of a subject when focused', () => {
    expect(formatStatistics(subject, true)).toBe(
      `${forRepeat('for repeat (95%)')} 5x 2 days before, last mastery: 0.5, last correctness: undefined`,
    );
  });

  it('does not show an infinite number of days of a subject', () => {
    const neverRepeated = {
      ...subject,
      lastRepetitionBeforeDays: Infinity,
      numberOfRepetitions: 0,
    };
    expect(formatStatistics(neverRepeated, true)).not.toContain('Infinity');
    expect(formatStatistics(neverRepeated, true)).toContain('0x');
  });
});

describe('getStatisticsColor', () => {
  it('uses the color of the learning state for a subject', () => {
    expect(getStatisticsColor(subject)('x')).toBe(
      learningStateColors.forRepeat('x'),
    );
  });

  it('uses the color of the highest number for aggregated statistics', () => {
    expect(getStatisticsColor(aggregated)('x')).toBe(
      learningStateColors.learned('x'),
    );
    expect(getStatisticsColor({ ...aggregated, forRepeat: 20 })('x')).toBe(
      learningStateColors.forRepeat('x'),
    );
  });
});

describe('sortChildren', () => {
  const aggregatedChild = (
    counts: [number, number, number, number],
  ): OverviewRecursiveStatistics => ({
    statistics: {
      avgLastRepetitionBeforeDays: 0,
      selected: 0,
      selectionState: 'implicitNoSelection',
      notLearned: counts[0],
      learning: counts[1],
      learned: counts[2],
      forRepeat: counts[3],
    },
  });
  const subjectChild = (mastery: number): OverviewRecursiveStatistics => ({
    statistics: { ...subject, mastery },
  });
  const sortedKeys = (children: Record<string, OverviewRecursiveStatistics>) =>
    sortChildren(Object.entries(children)).map(([key]) => key);

  it('sorts aggregated statistics by the relative learned numbers first', () => {
    expect(
      sortedKeys({
        // 1/10 learned
        low: aggregatedChild([0, 0, 1, 9]),
        // 2/4 learned although fewer absolute numbers than "high"
        high: aggregatedChild([1, 1, 2, 0]),
        // 4/20 learned
        middle: aggregatedChild([4, 4, 4, 8]),
      }),
    ).toEqual(['high', 'middle', 'low']);
  });

  it('sorts by the relative learning numbers and then the fewest not learned', () => {
    // All have the same share of learned (1/4)
    expect(
      sortedKeys({
        a: aggregatedChild([2, 1, 1, 0]),
        b: aggregatedChild([0, 1, 1, 2]),
        c: aggregatedChild([1, 2, 1, 0]),
        d: aggregatedChild([0, 2, 1, 1]),
      }),
    ).toEqual(['d', 'c', 'b', 'a']);
  });

  it('handles aggregated statistics without any numbers', () => {
    expect(
      sortedKeys({
        empty: aggregatedChild([0, 0, 0, 0]),
        learned: aggregatedChild([0, 0, 1, 0]),
      }),
    ).toEqual(['learned', 'empty']);
  });

  it('sorts subjects by the highest mastery first', () => {
    expect(
      sortedKeys({
        a: subjectChild(0.2),
        b: subjectChild(0.9),
        c: subjectChild(0.5),
      }),
    ).toEqual(['b', 'c', 'a']);
  });
});
