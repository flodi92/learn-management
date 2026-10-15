import { LearningState, LearnSubject, TimedResult } from '../../model';
import { computeSubjectStatisticsAt } from './computeSubjectStatisticsAt';
import { determineLearningStateFromStatisticsItem } from './determineLearningStateFromStatisticsItem';
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

  const {
    learning: learningInProgressSubjects = [],
    forRepeat: repeatSubjects = [],
    notLearned: notLearnedSubjects = [],
  } = Object.values(idSubjectMapping)
    .map(
      (subject) =>
        [
          subject,
          determineLearningStateFromStatisticsItem(
            subjectStatistics[subject.id],
          ),
        ] as const,
    )
    .reduce(
      (acc, [subject, learningState]) => {
        if (!acc[learningState]) {
          acc[learningState] = [];
        }
        acc[learningState].push(subject);
        return acc;
      },
      {} as Record<LearningState, S[] | undefined>,
    );

  const sessionSubjects = [
    ...learningInProgressSubjects,
    ...repeatSubjects,
  ].slice(0, count);

  if (sessionSubjects.length < count) {
    sessionSubjects.push(
      ...prioritizeSubjects(notLearnedSubjects, subjectStatistics).slice(
        0,
        count - sessionSubjects.length,
      ),
    );
  }

  return sessionSubjects;
};
