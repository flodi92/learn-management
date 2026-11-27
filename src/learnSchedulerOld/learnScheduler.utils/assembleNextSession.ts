import { LearningState, TaskDescription, TimedResult } from '../../model';
import { computeTaskDescriptionStatisticsAt } from './computeTaskDescriptionStatisticsAt';
import { determineLearningStateFromStatisticsItem } from './determineLearningStateFromStatisticsItem';
import { prioritizeTaskDescriptions } from './prioritizeTaskDescriptions';

interface AssembleNextSessionProps<TD extends TaskDescription> {
  count: number;
  timestamp: number;
  idTaskDescriptionMapping: Record<string, TD>;
  results: TimedResult[];
}

export const assembleNextSession = <TD extends TaskDescription>({
  count,
  timestamp,
  idTaskDescriptionMapping,
  results,
}: AssembleNextSessionProps<TD>): TD[] => {
  if (count <= 0) {
    return [];
  }

  const taskDescriptionStatistics = computeTaskDescriptionStatisticsAt(
    timestamp,
    idTaskDescriptionMapping,
    results,
  );

  const {
    learning: learningInProgressTaskDescriptions = [],
    forRepeat: repeatTaskDescriptions = [],
    notLearned: notLearnedTaskDescriptions = [],
  } = Object.values(idTaskDescriptionMapping)
    .map(
      (taskDescription) =>
        [
          taskDescription,
          determineLearningStateFromStatisticsItem(
            taskDescriptionStatistics[taskDescription.id],
          ),
        ] as const,
    )
    .reduce(
      (acc, [taskDescription, learningState]) => {
        if (!acc[learningState]) {
          acc[learningState] = [];
        }
        acc[learningState].push(taskDescription);
        return acc;
      },
      {} as Record<LearningState, TD[] | undefined>,
    );

  const sessionTaskDescriptions = [
    ...learningInProgressTaskDescriptions,
    ...repeatTaskDescriptions,
  ].slice(0, count);

  if (sessionTaskDescriptions.length < count) {
    sessionTaskDescriptions.push(
      ...prioritizeTaskDescriptions(
        notLearnedTaskDescriptions,
        taskDescriptionStatistics,
      ).slice(0, count - sessionTaskDescriptions.length),
    );
  }

  return sessionTaskDescriptions;
};
