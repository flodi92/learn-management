import { InitialRegExpTask, RegExpTask } from '../regExp.model';

type RegExpTaskWithIdAndElements = InitialRegExpTask & {
  id: RegExpTask['id'];
  elements: RegExpTask['elements'];
};

const isSubset = (
  subsetElements: RegExpTaskWithIdAndElements['elements'],
  supersetElements: RegExpTaskWithIdAndElements['elements'],
): boolean =>
  subsetElements.every((element) => supersetElements.includes(element));

const isProperSubset = (
  subsetElements: RegExpTaskWithIdAndElements['elements'],
  supersetElements: RegExpTaskWithIdAndElements['elements'],
): boolean =>
  isSubset(subsetElements, supersetElements) &&
  !isSubset(supersetElements, subsetElements);

// direct parents only: exclude ancestors that are already reachable through another parent
const getDirectParentIds = (
  task: RegExpTaskWithIdAndElements,
  candidates: RegExpTaskWithIdAndElements[],
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

export const setParentIds = <T extends RegExpTaskWithIdAndElements>(
  tasksWithElements: T[],
): (T & { parentIds: RegExpTask['parentIds'] })[] =>
  tasksWithElements.map((task) => ({
    ...task,
    parentIds: getDirectParentIds(task, tasksWithElements),
  }));
