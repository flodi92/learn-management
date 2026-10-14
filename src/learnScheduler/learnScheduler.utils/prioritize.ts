import {
  learningInProgressMasteryMax,
  learningInProgressMasteryMin,
} from '../learnScheduler.constants';
import { Task } from '../../model';
import { isNotUndefined } from '../../utils';

export type CategoryAndPriorityStatisticsItem = {
  category: string;
  priority: number;
  notLearned: number;
  learning: number;
  learned: number;
  all: number;
};

export type CategoryAndPriorityStatistics = Record<
  string,
  Record<number, CategoryAndPriorityStatisticsItem>
>;

export const getCategoryAndPriorityStatistics = (
  subjectStatistics: Record<string, { mastery: number }>,
  idTaskMapping: Record<string, Task>,
): CategoryAndPriorityStatistics => {
  const buffer = {} as CategoryAndPriorityStatistics;

  Object.entries(subjectStatistics).forEach(([id, { mastery }]) => {
    const { priority, categories } = idTaskMapping[id];
    if (!priority) return;

    (categories ?? []).forEach((category) => {
      if (!buffer[category]) {
        buffer[category] = {};
      }

      if (!buffer[category][priority]) {
        buffer[category][priority] = {
          category,
          priority,
          notLearned: 0,
          learning: 0,
          learned: 0,
          all: 0,
        };
      }

      if (mastery < learningInProgressMasteryMin) {
        buffer[category][priority].notLearned++;
      } else if (mastery > learningInProgressMasteryMax) {
        buffer[category][priority].learned++;
      } else {
        buffer[category][priority].learning++;
      }
      buffer[category][priority].all++;
    });
  });

  return buffer;
};

export const prioritizeByCategoryAndPriority = (
  statistics: CategoryAndPriorityStatistics,
  subjects: string[],
  idTaskMapping: Record<string, Task>,
): string[] => {
  let subjectsWithCategoryPriorityStatistics = subjects
    .map((id) => idTaskMapping[id])
    .map(
      (task) =>
        [
          task.id,
          task.categories
            ?.map((category) =>
              task.priority ? statistics[category][task.priority] : undefined,
            )
            .filter(isNotUndefined) ?? [],
        ] as const,
    );

  subjectsWithCategoryPriorityStatistics =
    subjectsWithCategoryPriorityStatistics.sort(([_, a], [__, b]) => {
      const sortedItems = [
        ...a.map((value) => ({ ...value, isA: true })),
        ...b.map((value) => ({ ...value, isA: false })),
      ].sort((a, b) => {
        if ((a.learning === 0) !== (b.learning === 0)) {
          return a.learning - b.learning;
        }

        if (a.learning > 0 && b.learning > 0) {
          if (a.category === b.category) {
            return a.priority - b.priority;
          } else {
            return a.learning / a.all - b.learning / b.all;
          }
        }

        if (a.learning === 0 && b.learning === 0) {
          if (a.category === b.category) {
            return a.priority - b.priority;
          } else {
            return a.notLearned / a.all - b.notLearned / b.all;
          }
        }

        return 0;
      });

      const isLastA = sortedItems.at(-1)?.isA;

      return isLastA ? 1 : -1;
    });

  return subjectsWithCategoryPriorityStatistics.map(([id]) => id);
};

export const getPrioritizedNewSubjects = (
  subjectStatistics: Record<string, { mastery: number }>,
  subjects: string[],
  idTaskMapping: Record<string, Task>,
): string[] => {
  const newSubjects = subjects.filter(
    (id) => subjectStatistics[id].mastery < learningInProgressMasteryMin,
  );

  const statistics = getCategoryAndPriorityStatistics(
    subjectStatistics,
    idTaskMapping,
  );

  return prioritizeByCategoryAndPriority(
    statistics,
    newSubjects,
    idTaskMapping,
  );
};
