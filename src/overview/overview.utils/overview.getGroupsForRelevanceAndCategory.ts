import { LearnSubject } from '../../model';
import {
  GetGroups,
  RelevanceCategoryGroupType,
} from './overview.computeStatistics.model';

export const getGroupsForRelevanceAndCategory: GetGroups<
  LearnSubject,
  RelevanceCategoryGroupType
> = (groupType, subject) =>
  groupType === 'category'
    ? (subject.categories ?? [])
    : [subject.relevance ?? 1];
