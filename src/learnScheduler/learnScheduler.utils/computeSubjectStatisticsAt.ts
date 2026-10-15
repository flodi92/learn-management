import { LearnSubject, TimedResult, SubjectStatistics } from '../../model';
import { getMasteries } from './getMasteries';

export const computeSubjectStatisticsAt = (
  time: number,
  idSubjectMapping: Record<string, LearnSubject>,
  results: TimedResult[],
): SubjectStatistics => {
  return Object.fromEntries(
    Object.keys(idSubjectMapping).map((id) => {
      const relevantResults = results
        .filter(
          (result) =>
            idSubjectMapping[result.id].parentIds?.includes(id) &&
            result.time <= time,
        )
        .sort((a, b) => a.time - b.time);

      const lastResult = relevantResults[relevantResults.length - 1];
      const lastRepetition = lastResult ? lastResult.time : undefined;
      const lastCorrectness = lastResult ? lastResult.correctness : 0;

      const mastery =
        relevantResults.length > 0
          ? (getMasteries(relevantResults, time)[id] ?? 0)
          : 0;

      const lastMastery =
        lastRepetition !== undefined && lastRepetition > 0
          ? (getMasteries(
              relevantResults.filter((result) => result.time <= lastRepetition),
              lastRepetition,
            )[id] ?? 0)
          : 0;

      return [
        id,
        {
          mastery,
          lastRepetition,
          lastMastery,
          lastCorrectness,
        },
      ];
    }),
  );
};
