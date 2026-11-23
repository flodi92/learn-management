import { computeTaskDescriptionStatisticsAt } from '../../learnScheduler/learnScheduler.utils/computeTaskDescriptionStatisticsAt';
import { TaskDescription, TimedResult } from '../../model';
import { OverviewTaskDescriptionStatisticsItem } from '../overview.model';
import {
  TaskDescriptionStatisticsTuple,
  TaskDescriptionStatisticsTuples,
} from './overview.computeStatistics.model';

export const computeTaskDescriptionsStatistics = <TD extends TaskDescription>(
  idTaskDescriptionMapping: Record<string, TD>,
  results: TimedResult[],
  day: number,
  getLabelFromId: (id: string) => string,
): TaskDescriptionStatisticsTuples<
  TD,
  OverviewTaskDescriptionStatisticsItem
> => {
  const taskDescriptionStatistics = computeTaskDescriptionStatisticsAt(
    day,
    idTaskDescriptionMapping,
    results,
  );

  return Object.entries(taskDescriptionStatistics).map(
    ([id, statisticsItem]) =>
      [
        id,
        idTaskDescriptionMapping[id],
        {
          id,
          label: getLabelFromId(id),
          mastery: statisticsItem.mastery,
          lastRepetitionBeforeDays:
            statisticsItem.lastRepetition === undefined
              ? Infinity
              : day - statisticsItem.lastRepetition,
          numberOfRepetitions: statisticsItem.numberOfRepetitions,
          learningState: statisticsItem.learningState,
          lastMastery: statisticsItem.lastMastery,
          lastCorrectness: statisticsItem.lastCorrectness,
        },
      ] satisfies TaskDescriptionStatisticsTuple<
        TD,
        OverviewTaskDescriptionStatisticsItem
      >,
  );
};
