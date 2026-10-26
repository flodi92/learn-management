import { computeSubjectStatisticsAt } from '../../learnScheduler/learnScheduler.utils/computeSubjectStatisticsAt';
import { determineLearningStateFromStatisticsItem } from '../../learnScheduler/learnScheduler.utils/determineLearningStateFromStatisticsItem';
import { LearnSubject, TimedResult } from '../../model';
import { SubjectStatisticsTuple } from '../overview.model';

export const computeSubjectsStatistics = <S extends LearnSubject>(
  idSubjectMapping: Record<string, S>,
  results: TimedResult[],
  day: number,
  getLabelFromId: (id: string) => string,
) => {
  const subjectStatistics = computeSubjectStatisticsAt(
    day,
    idSubjectMapping,
    results,
  );

  return Object.entries(subjectStatistics).map(
    ([id, statisticsItem]) =>
      [
        id,
        idSubjectMapping[id],
        {
          label: getLabelFromId(id),
          mastery: statisticsItem.mastery,
          lastRepetitionBeforeDays: statisticsItem.lastRepetition
            ? day - statisticsItem.lastRepetition
            : Infinity,
          numberOfRepetitions: statisticsItem.numberOfRepetitions,
          learningState:
            determineLearningStateFromStatisticsItem(statisticsItem),
          lastMastery: statisticsItem.lastMastery,
          lastCorrectness: statisticsItem.lastCorrectness,
        },
      ] satisfies SubjectStatisticsTuple<S>,
  );
};
