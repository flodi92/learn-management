import {
  learningInProgressMasteryMax,
  learningInProgressMasteryMin,
} from '../learnScheduler.constants';
import {
  CategoryAndRelevanceStatistics,
  LearnSubject,
  SubjectStatistics,
} from '../../model';
import { isNotUndefined } from '../../utils';
import { determineLearningStateFromStatisticsItem } from './determineLearningStateFromStatisticsItem';

export const getCategoryAndRelevanceStatistics = (
  subjectStatistics: SubjectStatistics,
  idSubjectMapping: Record<string, LearnSubject>,
): CategoryAndRelevanceStatistics => {
  const buffer = {} as CategoryAndRelevanceStatistics;

  Object.entries(subjectStatistics).forEach(([id, subjectStatisticsItem]) => {
    if (!idSubjectMapping[id]) return;

    const { relevance, categories } = idSubjectMapping[id];
    if (!relevance) return;

    (categories ?? []).forEach((category) => {
      if (!buffer[category]) {
        buffer[category] = {};
      }

      if (!buffer[category][relevance]) {
        buffer[category][relevance] = {
          category,
          relevance,
          notLearned: 0,
          learning: 0,
          forRepeat: 0,
          learned: 0,
          all: 0,
        };
      }

      const learningState = determineLearningStateFromStatisticsItem(
        subjectStatisticsItem,
      );

      buffer[category][relevance][learningState]++;
      buffer[category][relevance].all++;
    });
  });

  return buffer;
};

export const prioritizeByCategoryAndRelevance = <S extends LearnSubject>(
  statistics: CategoryAndRelevanceStatistics,
  subjects: S[],
): S[] => {
  const idSubjectMapping = Object.fromEntries(
    subjects.map((subject) => [subject.id, subject] as const),
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

export const prioritizeSubjects = <S extends LearnSubject>(
  subjects: S[],
  subjectStatistics: SubjectStatistics,
): S[] => {
  const idSubjectMapping = Object.fromEntries(
    subjects.map((subject) => [subject.id, subject] as const),
  );

  const statistics = getCategoryAndRelevanceStatistics(
    subjectStatistics,
    idSubjectMapping,
  );

  return prioritizeByCategoryAndRelevance(statistics, subjects);
};
