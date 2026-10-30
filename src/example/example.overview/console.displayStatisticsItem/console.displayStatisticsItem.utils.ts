import { LearningState, learningStates } from '../../../model';
import {
  OverviewAggregatedStatisticsItem,
  OverviewRecursiveStatistics,
  OverviewSubjectStatisticsItem,
  OverviewStatistics,
} from '../../../overview/overview.model';
import {
  learningStateColors,
  statisticsLabelColor,
} from '../console.constants';

const summarizedSubjectKeys = new Set<string>([
  'label',
  'mastery',
  'lastRepetitionBeforeDays',
  'numberOfRepetitions',
  'learningState',
]);

// "forRepeat" -> "for repeat"
export const camelCaseToWords = (text: string): string =>
  text.replace(/([a-z\d])([A-Z])/g, '$1 $2').toLowerCase();

export const isOverviewSubjectStatisticsItem = (
  statistics: OverviewStatistics,
): statistics is OverviewSubjectStatisticsItem => 'learningState' in statistics;

const formatLabeledValue = (
  key: string,
  value: unknown,
  color?: (text: string) => string,
) => {
  const text = String(value);
  return `${statisticsLabelColor(`${camelCaseToWords(key)}:`)} ${color ? color(text) : text}`;
};

const neverTrained = 'never trained';

export const formatAggregatedStatistics = (
  statistics: OverviewAggregatedStatisticsItem,
  isFocused: boolean,
): string => {
  const counts = learningStates.map((state) =>
    isFocused
      ? formatLabeledValue(state, statistics[state], learningStateColors[state])
      : learningStateColors[state](String(statistics[state])),
  );
  const average = Number.isFinite(statistics.avgLastRepetitionBeforeDays)
    ? `⌀ ${statistics.avgLastRepetitionBeforeDays} days before`
    : neverTrained;
  const separator = isFocused ? ', ' : ' ';
  return [...counts, average].join(separator);
};

export const formatSubjectStatistics = (
  statistics: OverviewSubjectStatisticsItem,
  isFocused: boolean,
): string => {
  const color = learningStateColors[statistics.learningState];
  const mastery = `${Math.round(statistics.mastery * 100)}%`;
  if (!isFocused) return color(mastery);

  const repetitions = Number.isFinite(statistics.lastRepetitionBeforeDays)
    ? `${statistics.numberOfRepetitions}x ${statistics.lastRepetitionBeforeDays} days before`
    : `${statistics.numberOfRepetitions}x`;
  const summary = [
    color(`${camelCaseToWords(statistics.learningState)} (${mastery})`),
    repetitions,
  ].join(' ');
  const otherValues = Object.entries(statistics)
    .filter(([key]) => !summarizedSubjectKeys.has(key))
    .map(([key, value]) => formatLabeledValue(key, value));
  return [summary, ...otherValues].join(', ');
};

export const formatStatistics = (
  statistics: OverviewStatistics,
  isFocused: boolean,
): string =>
  isOverviewSubjectStatisticsItem(statistics)
    ? formatSubjectStatistics(statistics, isFocused)
    : formatAggregatedStatistics(statistics, isFocused);

// Subjects use the color of their learning state, aggregated statistics the one of the highest number.
export const getStatisticsColor = (
  statistics: OverviewStatistics,
): ((text: string) => string) => {
  if (isOverviewSubjectStatisticsItem(statistics)) {
    return learningStateColors[statistics.learningState];
  }
  const dominantState = learningStates.reduce((dominant, state) =>
    statistics[state] > statistics[dominant] ? state : dominant,
  );
  return learningStateColors[dominantState];
};

const learningStateShares = (
  statistics: OverviewAggregatedStatisticsItem,
): Record<LearningState, number> => {
  const sum = learningStates.reduce((acc, state) => acc + statistics[state], 0);
  return Object.fromEntries(
    learningStates.map((state) => [
      state,
      sum === 0 ? 0 : statistics[state] / sum,
    ]),
  ) as Record<LearningState, number>;
};

const compareAggregatedStatistics = (
  a: OverviewAggregatedStatisticsItem,
  b: OverviewAggregatedStatisticsItem,
): number => {
  const sharesA = learningStateShares(a);
  const sharesB = learningStateShares(b);
  return (
    sharesB.learned - sharesA.learned ||
    sharesB.learning - sharesA.learning ||
    sharesA.notLearned - sharesB.notLearned
  );
};

export const compareStatistics = (
  a: OverviewStatistics,
  b: OverviewStatistics,
): number => {
  if (
    isOverviewSubjectStatisticsItem(a) &&
    isOverviewSubjectStatisticsItem(b)
  ) {
    return b.mastery - a.mastery;
  }
  if (
    !isOverviewSubjectStatisticsItem(a) &&
    !isOverviewSubjectStatisticsItem(b)
  ) {
    return compareAggregatedStatistics(a, b);
  }
  return 0;
};

export const sortChildren = (
  entries: [string, OverviewRecursiveStatistics][],
): [string, OverviewRecursiveStatistics][] =>
  [...entries].sort(([, a], [, b]) =>
    compareStatistics(a.statistics, b.statistics),
  );
