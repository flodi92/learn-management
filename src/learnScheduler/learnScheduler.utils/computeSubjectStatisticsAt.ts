import { LearnSubject, TimedResult, SubjectStatistics } from '../../model';
import { getMasteries } from './getMasteries';

export const computeSubjectStatisticsAt = (
  day: number,
  idSubjectMapping: Record<string, LearnSubject>,
  results: TimedResult[],
): SubjectStatistics => {
  return Object.fromEntries(
    Object.keys(idSubjectMapping).map((id) => {
      const relevantResults = results
        .filter(
          (result) =>
            idSubjectMapping[result.id].parentIds?.includes(id) &&
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
