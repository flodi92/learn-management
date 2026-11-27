import { getMastery } from '../../learnScheduler/learnScheduler.utils/getMastery';
import { getRepetitions } from '../../learnScheduler/learnScheduler.utils/getRepetitions';
import { TaskDescription, TimedResult } from '../../model';
import {
  OverviewExamination,
  OverviewTaskDescriptionStatisticsItem,
} from '../overview.model';
import {
  TaskDescriptionStatisticsTuple,
  TaskDescriptionStatisticsTuples,
} from './overview.computeStatistics.model';

export const computeTaskDescriptionsStatistics = <TD extends TaskDescription>(
  idTaskDescriptionMapping: Record<string, TD>,
  results: TimedResult[],
  timestamp: number,
  getLabelFromId: (id: string) => string,
): TaskDescriptionStatisticsTuples<
  TD,
  OverviewTaskDescriptionStatisticsItem
> => {
  // Results can refer to taskDescriptions that do not exist anymore, which have no label.
  const getConfusedLabel = (id: string) =>
    idTaskDescriptionMapping[id] ? getLabelFromId(id) : id;

  return Array.from(
    getRepetitions(timestamp, idTaskDescriptionMapping, results),
    ([id, repetitions]) => {
      const statisticsItem = getMastery(repetitions, timestamp);
      const examinations = repetitions
        .map(
          ({ timestamp: examinedTimestamp, correctness, wasConfusedWith }) =>
            ({
              examinedBefore: timestamp - examinedTimestamp,
              correctness,
              wasConfusedWith: (wasConfusedWith ?? []).map(getConfusedLabel),
            }) satisfies OverviewExamination,
        )
        .reverse();

      return [
        id,
        idTaskDescriptionMapping[id],
        {
          id,
          label: getLabelFromId(id),
          mastery: statisticsItem.mastery,
          lastRepetitionBefore:
            statisticsItem.lastRepetition === undefined
              ? Infinity
              : timestamp - statisticsItem.lastRepetition,
          numberOfRepetitions: statisticsItem.numberOfRepetitions,
          learningState: statisticsItem.learningState,
          lastMastery: statisticsItem.lastMastery,
          lastCorrectness: statisticsItem.lastCorrectness,
          examinations,
        },
      ] satisfies TaskDescriptionStatisticsTuple<
        TD,
        OverviewTaskDescriptionStatisticsItem
      >;
    },
  );
};
