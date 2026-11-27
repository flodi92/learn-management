import { TaskDescription, TimedResult } from '../../model';
import { LearnSchedulerStatistics } from '../learnScheduler.model';
import { getMastery } from './getMastery';
import { getRepetitions } from './getRepetitions';

export const computeTaskDescriptionStatisticsAt = (
  timestamp: number,
  idTaskDescriptionMapping: Record<string, TaskDescription>,
  results: TimedResult[],
): LearnSchedulerStatistics =>
  Object.fromEntries(
    Array.from(
      getRepetitions(timestamp, idTaskDescriptionMapping, results),
      ([id, taskRepetitions]) => [id, getMastery(taskRepetitions, timestamp)],
    ),
  );
