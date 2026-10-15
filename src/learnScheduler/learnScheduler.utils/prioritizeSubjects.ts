import {
  CategoryAndRelevanceStatistics,
  LearnSubject,
  SubjectStatistics,
} from '../../model';
import { isNotUndefined } from '../../utils';
import { determineCategoryAndRelevanceStatistics } from './determineCategoryAndRelevanceStatistics';

export const prioritizeSubjects = <S extends LearnSubject>(
  subjects: S[],
  subjectStatistics: SubjectStatistics,
): S[] => {
  const idSubjectMapping = Object.fromEntries(
    subjects.map((subject) => [subject.id, subject] as const),
  );

  const statistics = determineCategoryAndRelevanceStatistics(
    subjectStatistics,
    idSubjectMapping,
  );

  let subjectsWithCategoryRelevanceStatistics = subjects.map(
    (subject) =>
      [
        subject.id,
        subject.categories
          ?.map((category) =>
            subject.relevance
              ? statistics[category][subject.relevance]
              : undefined,
          )
          .filter(isNotUndefined) ?? [],
      ] as const,
  );

  subjectsWithCategoryRelevanceStatistics =
    subjectsWithCategoryRelevanceStatistics.sort(([_, a], [__, b]) => {
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

  return subjectsWithCategoryRelevanceStatistics.map(
    ([id]) => idSubjectMapping[id],
  );
};
