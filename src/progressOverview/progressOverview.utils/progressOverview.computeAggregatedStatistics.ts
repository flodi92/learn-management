import {
  OverviewSubjectStatisticsItem,
  OverviewAggregatedStatisticsItem,
} from '../progressOverview.model';

export const computeAggregatedStatistics = (
  statisticsItems: OverviewSubjectStatisticsItem[],
): OverviewAggregatedStatisticsItem => ({
  avgLastRepetitionBeforeDays: statisticsItems.reduce(
    (acc, item) => acc + item.lastRepetitionBeforeDays,
    0,
  ),
  notLearned: statisticsItems.filter(
    (item) => item.learningState === 'notLearned',
  ).length,
  learning: statisticsItems.filter((item) => item.learningState === 'learning')
    .length,
  learned: statisticsItems.filter((item) => item.learningState === 'learned')
    .length,
  forRepeat: statisticsItems.filter(
    (item) => item.learningState === 'forRepeat',
  ).length,
});
