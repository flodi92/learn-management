import {
  OverviewSubjectStatisticsItem,
  OverviewAggregatedStatisticsItem,
} from '../overview.model';

export const computeAggregatedStatistics = (
  statisticsItems: OverviewSubjectStatisticsItem[],
  selectedIds: string[],
): OverviewAggregatedStatisticsItem => ({
  avgLastRepetitionBeforeDays: statisticsItems.reduce(
    (acc, item) => acc + item.lastRepetitionBeforeDays,
    0,
  ),
  selected: statisticsItems.filter((item) => selectedIds.includes(item.id))
    .length,
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
