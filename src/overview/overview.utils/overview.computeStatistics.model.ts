import { LearnSubject, TimedResult } from '../../model';
import { SubjectStatisticsTuples } from '../overview.model';

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

export type ComputeSubjectStatistics<
  Subject extends LearnSubject,
  SubjectStatistics extends object,
> = (
  idSubjectMapping: Record<string, Subject>,
  results: TimedResult[],
  day: number,
  getLabelFromId: (id: string) => string,
) => SubjectStatisticsTuples<Subject, SubjectStatistics>;

export type RelevanceCategoryGroupType = 'relevance' | 'category';
