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
> = (groupType, taskDescription, { learningState }) => {
  switch (groupType) {
    case 'category':
      return taskDescription.categories ?? [];
    case 'learningState':
      return [learningState];
    default:
      return [taskDescription.relevance ?? 1];
  }
};
