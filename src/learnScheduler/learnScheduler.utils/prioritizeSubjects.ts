import {
  learningInProgressMasteryMax,
  learningInProgressMasteryMin,
} from '../learnScheduler.constants';
import { LearnSubject } from '../../model';
import { isNotUndefined } from '../../utils';

export type CategoryAndRelevanceStatisticsItem = {
  category: string;
  relevance: number;
  notLearned: number;
  learning: number;
  learned: number;
  all: number;
};

export type CategoryAndRelevanceStatistics = Record<
  string,
  Record<number, CategoryAndRelevanceStatisticsItem>
>;

export const getCategoryAndRelevanceStatistics = (
  subjectStatistics: Record<string, { mastery: number }>,
  idSubjectMapping: Record<string, LearnSubject>,
): CategoryAndRelevanceStatistics => {
  const buffer = {} as CategoryAndRelevanceStatistics;

  Object.entries(subjectStatistics).forEach(([id, { mastery }]) => {
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
          learned: 0,
          all: 0,
        };
      }

      if (mastery < learningInProgressMasteryMin) {
        buffer[category][relevance].notLearned++;
      } else if (mastery > learningInProgressMasteryMax) {
        buffer[category][relevance].learned++;
      } else {
        buffer[category][relevance].learning++;
      }
      buffer[category][relevance].all++;
    });
  });

  return buffer;
};

export const prioritizeByCategoryAndRelevance = (
  statistics: CategoryAndRelevanceStatistics,
  subjects: string[],
  idSubjectMapping: Record<string, LearnSubject>,
): string[] => {
  let subjectsWithCategoryRelevanceStatistics = subjects
    .map((id) => idSubjectMapping[id])
    .map(
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

  return subjectsWithCategoryRelevanceStatistics.map(([id]) => id);
};

export const prioritizeSubjects = (
  subjectStatistics: Record<string, { mastery: number }>,
  subjects: string[],
  idSubjectMapping: Record<string, LearnSubject>,
): string[] => {
  const statistics = getCategoryAndRelevanceStatistics(
    subjectStatistics,
    idSubjectMapping,
  );

  return prioritizeByCategoryAndRelevance(
    statistics,
    subjects,
    idSubjectMapping,
  );
};
