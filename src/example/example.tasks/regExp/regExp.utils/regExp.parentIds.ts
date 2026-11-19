import {
  InitialRegExpTaskDescription,
  RegExpTaskDescription,
} from '../regExp.model';

type RegExpTaskDescriptionWithIdAndElements = InitialRegExpTaskDescription & {
  id: RegExpTaskDescription['id'];
  elements: RegExpTaskDescription['elements'];
};

const isSubset = (
  subsetElements: RegExpTaskDescriptionWithIdAndElements['elements'],
  supersetElements: RegExpTaskDescriptionWithIdAndElements['elements'],
): boolean =>
  subsetElements.every((element) => supersetElements.includes(element));

const isProperSubset = (
  subsetElements: RegExpTaskDescriptionWithIdAndElements['elements'],
  supersetElements: RegExpTaskDescriptionWithIdAndElements['elements'],
): boolean =>
  isSubset(subsetElements, supersetElements) &&
  !isSubset(supersetElements, subsetElements);

// direct parents only: exclude ancestors that are already reachable through another parent
const getDirectParentIds = (
  taskDescription: RegExpTaskDescriptionWithIdAndElements,
  candidates: RegExpTaskDescriptionWithIdAndElements[],
): string[] => {
  const ancestors = candidates.filter(
    (candidate) =>
      candidate.id !== taskDescription.id &&
      isProperSubset(candidate.elements, taskDescription.elements),
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

export const setParentIds = <T extends RegExpTaskDescriptionWithIdAndElements>(
  taskDescriptionsWithElements: T[],
): (T & { parentIds: RegExpTaskDescription['parentIds'] })[] =>
  taskDescriptionsWithElements.map((taskDescription) => ({
    ...taskDescription,
    parentIds: getDirectParentIds(
      taskDescription,
      taskDescriptionsWithElements,
    ),
  }));
