import {
  TaskDescription,
  TaskDescriptionStatistics,
  TimedResult,
} from '../../model';

export const computeTaskDescriptionStatisticsAt = (
  day: number,
  idTaskDescriptionMapping: Record<string, TaskDescription>,
  results: TimedResult[],
): TaskDescriptionStatistics => {
  throw 'not implemented';
};
