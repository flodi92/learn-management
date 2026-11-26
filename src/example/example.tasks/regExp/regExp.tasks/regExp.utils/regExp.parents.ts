import { InitialRegExpTaskDescription, RegExpSubject } from '../regExp.model';

const isSubset = (
  subsetElements: RegExpSubject[],
  supersetElements: RegExpSubject[],
): boolean =>
  subsetElements.every((element) => supersetElements.includes(element));

const isProperSubset = (
  subsetElements: RegExpSubject[],
  supersetElements: RegExpSubject[],
): boolean =>
  isSubset(subsetElements, supersetElements) &&
  !isSubset(supersetElements, subsetElements);

// direct parents only: exclude ancestors that are already reachable through another parent
export const getParentExpressions = (
  task: InitialRegExpTaskDescription,
  candidates: InitialRegExpTaskDescription[],
): RegExp[] => {
  const ancestors = candidates.filter(
    (candidate) =>
      String(candidate.expression) !== String(task.expression) &&
      isProperSubset(candidate.subjects, task.subjects),
  );

  const directParents = ancestors.filter(
    (ancestor) =>
      !ancestors.some(
        (otherAncestor) =>
          String(otherAncestor.expression) !== String(ancestor.expression) &&
          isProperSubset(ancestor.subjects, otherAncestor.subjects),
      ),
  );

  return directParents.map((parent) => parent.expression);
};
