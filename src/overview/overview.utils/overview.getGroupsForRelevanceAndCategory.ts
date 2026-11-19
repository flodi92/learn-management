import { TaskDescription } from '../../model';
import { GetGroups } from './overview.computeStatistics.model';
import { RelevanceCategoryGroupType } from '../overview.model';

export const getGroupsForRelevanceAndCategory: GetGroups<
  TaskDescription,
  RelevanceCategoryGroupType
> = (groupType, taskDescription) =>
  groupType === 'category'
    ? (taskDescription.categories ?? [])
    : [taskDescription.relevance ?? 1];
