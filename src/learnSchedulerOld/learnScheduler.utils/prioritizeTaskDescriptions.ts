import {
  CategoryAndRelevanceStatistics,
  TaskDescription,
  TaskDescriptionStatistics,
} from '../../model';
import { isNotUndefined } from '../../utils';
import { determineCategoryAndRelevanceStatistics } from './determineCategoryAndRelevanceStatistics';

export const prioritizeTaskDescriptions = <TD extends TaskDescription>(
  taskDescriptions: TD[],
  taskDescriptionStatistics: TaskDescriptionStatistics,
): TD[] => {
  const idTaskDescriptionMapping = Object.fromEntries(
    taskDescriptions.map(
      (taskDescription) => [taskDescription.id, taskDescription] as const,
    ),
  );

  const statistics = determineCategoryAndRelevanceStatistics(
    taskDescriptionStatistics,
    idTaskDescriptionMapping,
  );

  let taskDescriptionsWithCategoryRelevanceStatistics = taskDescriptions.map(
    (taskDescription) =>
      [
        taskDescription.id,
        taskDescription.categories
          ?.map((category) =>
            taskDescription.relevance
              ? statistics[category][taskDescription.relevance]
              : undefined,
          )
          .filter(isNotUndefined) ?? [],
      ] as const,
  );

  taskDescriptionsWithCategoryRelevanceStatistics =
    taskDescriptionsWithCategoryRelevanceStatistics.sort(([_, a], [__, b]) => {
      const sortedItems = [
        ...a.map((value) => ({ ...value, isA: true })),
        ...b.map((value) => ({ ...value, isA: false })),
      ].sort((a, b) => {
        if ((a.learning === 0) !== (b.learning === 0)) {
          return a.learning - b.learning;
        }

        if (a.learning > 0 && b.learning > 0) {
          if (a.category === b.category) {
            return a.relevance - b.relevance;
          } else {
            return a.learning / a.all - b.learning / b.all;
          }
        }

        if (a.learning === 0 && b.learning === 0) {
          if (a.category === b.category) {
            return a.relevance - b.relevance;
          } else {
            return a.notLearned / a.all - b.notLearned / b.all;
          }
        }

        return 0;
      });

      const isLastA = sortedItems.at(-1)?.isA;

      return isLastA ? 1 : -1;
    });

  return taskDescriptionsWithCategoryRelevanceStatistics.map(
    ([id]) => idTaskDescriptionMapping[id],
  );
};
