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
const getDirectParents = (
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

export const setParents = <T extends RegExpTaskDescriptionWithIdAndElements>(
  taskDescriptionsWithElements: T[],
): (T & { parents: RegExpTaskDescription['parents'] })[] =>
  taskDescriptionsWithElements.map((taskDescription) => ({
    ...taskDescription,
    parents: getDirectParents(taskDescription, taskDescriptionsWithElements),
  }));
