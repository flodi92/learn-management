import { LearnSubject } from '../../model';
import { GetGroups } from './overview.computeStatistics.model';
import { RelevanceCategoryGroupType } from '../overview.model';

export const getGroupsForRelevanceAndCategory: GetGroups<
  LearnSubject,
  RelevanceCategoryGroupType
> = (groupType, subject) =>
  groupType === 'category'
    ? (subject.categories ?? [])
    : [subject.relevance ?? 1];
