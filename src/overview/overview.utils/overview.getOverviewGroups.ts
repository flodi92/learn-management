import { TaskDescription } from '../../model';
import { GetGroups } from './overview.computeStatistics.model';
import {
  OverviewTaskDescriptionStatisticsItem,
  OverviewGroupType,
} from '../overview.model';

export const getOverviewGroups: GetGroups<
  TaskDescription,
  OverviewTaskDescriptionStatisticsItem,
  OverviewGroupType
> = (groupType, taskDescription, { learningState }, selectedIds) => {
  switch (groupType) {
    case 'category':
      return taskDescription.categories ?? [];
    case 'subject':
      return taskDescription.subjects ?? [];
    case 'complexity':
      return [taskDescription.complexity ?? 1];
    case 'relevance':
      return [taskDescription.relevance ?? 1];
    case 'learningState':
      return [learningState];
    case 'selectionState':
      return [
        selectedIds.includes(taskDescription.id) ? 'selected' : 'notSelected',
      ];
    case 'taskDescription':
      return [taskDescription.id];
  }
};
