import { LearningState, learningStates } from '../../../model';
import {
  OverviewAggregatedStatisticsItem,
  OverviewRecursiveStatistics,
  OverviewStatistics,
} from '../../../overview/overview.model';
import { isOverviewSubjectStatisticsItem } from './console.formatStatistics';

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

const compareStatistics = (
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
