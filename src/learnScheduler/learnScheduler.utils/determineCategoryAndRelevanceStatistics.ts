import {
  SubjectStatistics,
  LearnSubject,
  CategoryAndRelevanceStatistics,
} from '../../model';
import { determineLearningStateFromStatisticsItem } from './determineLearningStateFromStatisticsItem';

export const determineCategoryAndRelevanceStatistics = (
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
