import { TaskDescription } from '../../model';
import { LearnSchedulerCharacteristicsMapping } from '../learnScheduler.model';

export const isProperSubjectSubset = (
  subset: TaskDescription,
  superset: TaskDescription,
) => {
  const subsetSubjects = new Set(subset.subjects);
  const supersetSubjects = new Set(superset.subjects);
  return (
    subsetSubjects.size > 0 &&
    subsetSubjects.size < supersetSubjects.size &&
    [...subsetSubjects].every((subject) => supersetSubjects.has(subject))
  );
};

export const shareCategory = (a: TaskDescription, b: TaskDescription) =>
  a.categories?.some((category) => b.categories?.includes(category)) ?? false;

export const getRelatedness = (a: TaskDescription, b: TaskDescription) => {
  if (a.id === b.id) return 0;
  if (a.equalTo?.includes(b.id) || b.equalTo?.includes(a.id)) return 3;
  if (a.confusedWith?.includes(b.id) || b.confusedWith?.includes(a.id))
    return 2;
  return shareCategory(a, b) ? 1 : 0;
};

export const compareOptionalNumbers = (a?: number, b?: number) =>
  a === undefined ? (b === undefined ? 0 : 1) : b === undefined ? -1 : a - b;

export const compareIds = (a: string, b: string) =>
  a < b ? -1 : a > b ? 1 : 0;

export const computeCharacteristics = (
  taskDescriptions: TaskDescription[],
): LearnSchedulerCharacteristicsMapping => {
  const minimum = (values: (number | undefined)[]) => {
    const defined = values.filter((value) => value !== undefined);
    return defined.length === 0 ? undefined : Math.min(...defined);
  };

  return Object.fromEntries(
    taskDescriptions.map((taskDescription) => {
      const supersets = taskDescriptions.filter((other) =>
        isProperSubjectSubset(taskDescription, other),
      );
      return [
        taskDescription.id,
        {
          effectiveRelevance: minimum([
            taskDescription.relevance,
            ...supersets.map((other) => other.relevance),
          ]),
          effectiveComplexity: minimum([
            taskDescription.complexity,
            ...supersets.map((other) => other.complexity),
          ]),
          prerequisiteIds: taskDescriptions
            .filter((other) => isProperSubjectSubset(other, taskDescription))
            .map((other) => other.id),
          minimumCategoryRelevance: minimum(
            taskDescriptions
              .filter((other) => shareCategory(taskDescription, other))
              .map((other) => other.relevance),
          ),
        },
      ];
    }),
  );
};
