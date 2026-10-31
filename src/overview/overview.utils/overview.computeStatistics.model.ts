import { LearnSubject } from '../../model';

export type GroupTypeOrSubject<GroupType extends string> =
  GroupType | 'subject';

export type GetGroups<
  Subject extends LearnSubject,
  GroupType extends string,
> = (
  GroupTypeOrSubject: GroupTypeOrSubject<GroupType>,
  subject: Subject,
) => string[] | number[];

export type ComputeAggregatedStatistics<
  SubjectStatistics extends object,
  AggregatedStatistics extends object,
> = (tuples: SubjectStatistics[]) => AggregatedStatistics;

export type RelevanceCategoryGroupType = 'relevance' | 'category';
