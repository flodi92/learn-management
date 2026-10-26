import { computeSubjectStatisticsAt } from '../../learnScheduler/learnScheduler.utils/computeSubjectStatisticsAt';
import { determineLearningStateFromStatisticsItem } from '../../learnScheduler/learnScheduler.utils/determineLearningStateFromStatisticsItem';
import { LearnSubject, TimedResult } from '../../model';
import { ProgressTuple } from '../progressOverview.model';

export const getItemStatistics = <S extends LearnSubject>(
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
        },
      ] as ProgressTuple<S>,
  );
};
