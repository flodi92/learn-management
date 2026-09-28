import { RegexTask } from './regex.model';

type TaskWithElements = Omit<RegexTask, 'parentIds'>;

const isSubset = (
  subsetElements: TaskWithElements['elements'],
  supersetElements: TaskWithElements['elements'],
): boolean =>
  subsetElements.every((element) => supersetElements.includes(element));

const isProperSubset = (
  subsetElements: TaskWithElements['elements'],
  supersetElements: TaskWithElements['elements'],
): boolean =>
  isSubset(subsetElements, supersetElements) &&
  !isSubset(supersetElements, subsetElements);

// direct parents only: exclude ancestors that are already reachable through another parent
const getDirectParentIds = (
  task: TaskWithElements,
  candidates: TaskWithElements[],
): string[] => {
  const ancestors = candidates.filter(
    (candidate) =>
      candidate.id !== task.id &&
      isProperSubset(candidate.elements, task.elements),
  );

  const directParents = ancestors.filter(
    (ancestor) =>
      !ancestors.some(
        (otherAncestor) =>
          otherAncestor.id !== ancestor.id &&
          isProperSubset(ancestor.elements, otherAncestor.elements),
      ),
  );

  return directParents.map((parent) => parent.id);
};

export const setParentIds = (
  tasksWithElements: TaskWithElements[],
): RegexTask[] =>
  tasksWithElements.map((task) => ({
    ...task,
    parentIds: getDirectParentIds(task, tasksWithElements),
  }));
