import {
  TaskDescription,
  TaskDescriptionStatistics,
  TimedResult,
} from '../../model';
import { getMasteries } from './getMasteries';

export const computeTaskDescriptionStatisticsAt = (
  day: number,
  idTaskDescriptionMapping: Record<string, TaskDescription>,
  results: TimedResult[],
): TaskDescriptionStatistics => {
  return Object.fromEntries(
    Object.keys(idTaskDescriptionMapping).map((id) => {
      const relevantResults = results
        .filter(
          (result) =>
            idTaskDescriptionMapping[result.id].parents?.includes(id) &&
            result.day <= day,
        )
        .sort((a, b) => a.day - b.day);

      const lastResult = relevantResults[relevantResults.length - 1];
      const lastRepetition = lastResult ? lastResult.day : undefined;
      const lastCorrectness = lastResult ? lastResult.correctness : undefined;

      const mastery =
        relevantResults.length > 0
          ? (getMasteries(relevantResults, day)[id] ?? 0)
          : 0;

      const lastMastery =
        lastRepetition !== undefined && lastRepetition > 0
          ? (getMasteries(
              relevantResults.filter((result) => result.day <= lastRepetition),
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
