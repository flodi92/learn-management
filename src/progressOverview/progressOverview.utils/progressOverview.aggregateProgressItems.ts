import { ProgressItem, ProgressAggregation } from '../progressOverview.model';

export const aggregateProgressItems = (
  progressItems: ProgressItem[],
): ProgressAggregation => ({
  avgLastRepetitionBeforeDays: progressItems.reduce(
    (acc, item) => acc + item.lastRepetitionBeforeDays,
    0,
  ),
  notLearned: progressItems.filter(
    (item) => item.learningState === 'notLearned',
  ).length,
  learning: progressItems.filter((item) => item.learningState === 'learning')
    .length,
  learned: progressItems.filter((item) => item.learningState === 'learned')
    .length,
  forRepeat: progressItems.filter((item) => item.learningState === 'forRepeat')
    .length,
});
