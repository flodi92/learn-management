import { describe, expect, it } from 'vitest';
import {
  OverviewAggregatedStatisticsItem,
  OverviewSubjectStatisticsItem,
} from '../../overview/overview.model';
import { learningStateColors, statisticsLabelColor } from './console.constants';
import {
  camelCaseToWords,
  formatStatistics,
  isOverviewSubjectStatisticsItem,
} from './console.displayStatistics.utils';

const aggregated: OverviewAggregatedStatisticsItem = {
  avgLastRepetitionBeforeDays: 19,
  notLearned: 6,
  learning: 5,
  learned: 9,
  forRepeat: 4,
};

const subject: OverviewSubjectStatisticsItem = {
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

  it('shows only the colored numbers of aggregated statistics', () => {
    expect(formatStatistics(aggregated, false)).toBe(
      `⌀ 19 days before ${notLearned('6')} ${learning('5')} ${learned('9')} ${forRepeat('4')}`,
    );
  });

  it('adds the learning states to aggregated statistics when focused', () => {
    const label = statisticsLabelColor;
    expect(formatStatistics(aggregated, true)).toBe(
      `⌀ 19 days before ${label('not learned:')} ${notLearned('6')}, ${label('learning:')} ${learning('5')}, ${label('learned:')} ${learned('9')}, ${label('for repeat:')} ${forRepeat('4')}`,
    );
  });

  it('shows learning state, mastery and repetitions of a subject without its label', () => {
    expect(formatStatistics(subject, false)).toBe(
      `${forRepeat('for repeat (95%)')} 5x 2 days before`,
    );
  });

  it('shows all other values of a subject with separated words when focused', () => {
    const label = statisticsLabelColor;
    expect(formatStatistics(subject, true)).toBe(
      `${forRepeat('for repeat (95%)')} 5x 2 days before, ${label('last mastery:')} 0.5, ${label('last correctness:')} undefined`,
    );
  });
});
