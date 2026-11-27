import {
  TaskDescription,
  TaskDescriptionStatistics,
  TimedResult,
} from '../../model';
import { getMasteries } from './getMasteries';

export const computeTaskDescriptionStatisticsAt = (
  timestamp: number,
  idTaskDescriptionMapping: Record<string, TaskDescription>,
  results: TimedResult[],
): TaskDescriptionStatistics => {
  return Object.fromEntries(
    Object.keys(idTaskDescriptionMapping).map((id) => {
      const relevantResults = results
        .filter(
          (result) =>
            idTaskDescriptionMapping[result.id].parents?.includes(id) &&
            result.timestamp <= timestamp,
        )
        .sort((a, b) => a.timestamp - b.timestamp);

      const lastResult = relevantResults[relevantResults.length - 1];
      const lastRepetition = lastResult ? lastResult.timestamp : undefined;
      const lastCorrectness = lastResult ? lastResult.correctness : undefined;

      const mastery =
        relevantResults.length > 0
          ? (getMasteries(relevantResults, timestamp)[id] ?? 0)
          : 0;

      const lastMastery =
        lastRepetition !== undefined && lastRepetition > 0
          ? (getMasteries(
              relevantResults.filter(
                (result) => result.timestamp <= lastRepetition,
              ),
              lastRepetition,
            )[id] ?? 0)
          : undefined;

      return [
        id,
        {
          mastery,
          lastRepetition,
          lastMastery,
          lastCorrectness,
          numberOfRepetitions: relevantResults.length,
        },
      ];
    }),
  );
};
