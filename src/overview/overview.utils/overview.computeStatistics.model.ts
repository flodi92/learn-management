import { LearnSubject, TimedResult } from '../../model';

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
> = (
  tuples: SubjectStatistics[],
  selectedIds: string[],
  groupSelection: boolean | undefined,
) => AggregatedStatistics;

export type ComputeSubjectStatistics<
  Subject extends LearnSubject,
  SubjectStatistics extends object,
> = (
  idSubjectMapping: Record<string, Subject>,
  results: TimedResult[],
  day: number,
  getLabelFromId: (id: string) => string,
) => SubjectStatisticsTuples<Subject, SubjectStatistics>;

export type SubjectStatisticsTuple<
  Subject extends LearnSubject,
  Statistics extends object,
> = [string, Subject, Statistics];

export type SubjectStatisticsTuples<
  Subject extends LearnSubject,
  Statistics extends object,
> = SubjectStatisticsTuple<Subject, Statistics>[];

export interface OverviewRecursiveUndeterminedStatistics<
  Statistics extends object = object,
  GroupType extends string = string,
> {
  statistics: Statistics;
  groupType?: GroupType;
  parentGroups?: readonly (readonly [GroupType, string | number])[];
  children?: Record<
    string | number,
    OverviewRecursiveUndeterminedStatistics<Statistics, GroupType>
  >;
  getChildrenIds?(path: [GroupType, string | number][]): string[];
}
