import { LearnSubject, TimedResult } from '../../model';
import {
  learningInProgressMasteryMax,
  learningInProgressMasteryMin,
  repeatSubjectsMasteryMax,
} from '../learnScheduler.constants';
import { computeSubjectStatisticsAt } from './computeSubjectStatisticsAt';
import { prioritizeSubjects } from './prioritizeSubjects';

interface AssembleNextSessionProps<S extends LearnSubject> {
  count: number;
  time: number;
  idSubjectMapping: Record<string, S>;
  results: TimedResult[];
}

export const assembleNextSession = <S extends LearnSubject>({
  count,
  time,
  idSubjectMapping,
  results,
}: AssembleNextSessionProps<S>): S[] => {
  if (count <= 0) {
    return [];
  }

  const subjectStatistics = computeSubjectStatisticsAt(
    time,
    idSubjectMapping,
    results,
  );

  const learningInProgressSubjects = Object.keys(idSubjectMapping).filter(
    (id) => {
      const { mastery, lastMastery } = subjectStatistics[id];
      return (
        mastery > learningInProgressMasteryMin &&
        mastery < learningInProgressMasteryMax &&
        lastMastery < learningInProgressMasteryMax
      );
    },
  );

  const repeatSubjects = Object.keys(idSubjectMapping).filter((id) => {
    const { mastery, lastMastery } = subjectStatistics[id];
    return (
      lastMastery > learningInProgressMasteryMax &&
      mastery < repeatSubjectsMasteryMax
    );
  });

  const repeatWrongSubjects = Object.keys(idSubjectMapping).filter((id) => {
    const { lastCorrectness, lastRepetition } = subjectStatistics[id];
    return lastRepetition !== undefined && lastCorrectness <= 0.5;
  });

  const sessionSubjects = Array.from(
    new Set([
      ...learningInProgressSubjects,
      ...repeatSubjects,
      ...repeatWrongSubjects,
    ]),
  ).slice(0, count);

  if (sessionSubjects.length < count) {
    const newSubjects = Object.values(idSubjectMapping).filter(
      (subject) =>
        subjectStatistics[subject.id].mastery < learningInProgressMasteryMin,
    );

    sessionSubjects.push(
      ...prioritizeSubjects(subjectStatistics, newSubjects).slice(
        0,
        count - sessionSubjects.length,
      ),
    );
  }

  return sessionSubjects.map((id) => idSubjectMapping[id]);
};
