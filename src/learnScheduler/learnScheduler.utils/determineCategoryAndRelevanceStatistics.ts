import {
  CategoryAndRelevanceStatistics,
  TaskDescription,
  TaskDescriptionStatistics,
} from '../../model';
import { determineLearningStateFromStatisticsItem } from './determineLearningStateFromStatisticsItem';

export const determineCategoryAndRelevanceStatistics = (
  taskDescriptionStatistics: TaskDescriptionStatistics,
  idTaskDescriptionMapping: Record<string, TaskDescription>,
): CategoryAndRelevanceStatistics => {
  const buffer = {} as CategoryAndRelevanceStatistics;

  Object.entries(taskDescriptionStatistics).forEach(
    ([id, taskDescriptionStatisticsItem]) => {
      if (!idTaskDescriptionMapping[id]) return;

      const { relevance, categories } = idTaskDescriptionMapping[id];
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
          taskDescriptionStatisticsItem,
        );

        buffer[category][relevance][learningState]++;
        buffer[category][relevance].all++;
      });
    },
  );

  return buffer;
};
