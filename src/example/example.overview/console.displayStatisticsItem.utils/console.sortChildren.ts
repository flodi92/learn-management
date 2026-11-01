import { LearningState, learningStates } from '../../../model';
import {
  OverviewAggregatedStatisticsItem,
  OverviewStatistics,
} from '../../../overview/overview.model';
import { OverviewRecursiveUndeterminedStatistics } from '../../../overview/overview.utils/overview.computeStatistics.model';
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

export const sortChildren = <
  Statistics extends OverviewStatistics,
  GroupType extends string,
>(
  entries: [
    string,
    OverviewRecursiveUndeterminedStatistics<Statistics, GroupType>,
  ][],
): [string, OverviewRecursiveUndeterminedStatistics<Statistics, GroupType>][] =>
  [...entries].sort(([, a], [, b]) =>
    compareStatistics(a.statistics, b.statistics),
  );
