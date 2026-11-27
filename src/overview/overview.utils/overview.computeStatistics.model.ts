import { TaskDescription, TimedResult } from '../../model';

export type GroupTypeOrTaskDescription<GroupType extends string> =
  GroupType | 'taskDescription';

export type GetGroups<
  TD extends TaskDescription,
  TaskDescriptionStatistics extends object,
  GroupType extends string,
> = (
  groupTypeOrTaskDescription: GroupTypeOrTaskDescription<GroupType>,
  taskDescription: TD,
  statistics: TaskDescriptionStatistics,
  selectedIds: string[],
) => string[] | number[];

export type ComputeAggregatedStatistics<
  TaskDescriptionStatistics extends object,
  AggregatedStatistics extends object,
> = (
  tuples: TaskDescriptionStatistics[],
  selectedIds: string[],
  groupSelection: boolean | undefined,
) => AggregatedStatistics;

export type ComputeTaskDescriptionStatistics<
  TD extends TaskDescription,
  TaskDescriptionStatistics extends object,
> = (
  idTaskDescriptionMapping: Record<string, TD>,
  results: TimedResult[],
  day: number,
  getLabelFromId: (id: string) => string,
) => TaskDescriptionStatisticsTuples<TD, TaskDescriptionStatistics>;

export type TaskDescriptionStatisticsTuple<
  TD extends TaskDescription,
  Statistics extends object,
> = [string, TD, Statistics];

export type TaskDescriptionStatisticsTuples<
  TD extends TaskDescription,
  Statistics extends object,
> = TaskDescriptionStatisticsTuple<TD, Statistics>[];

export interface OverviewRecursiveUndeterminedStatistics<
  Statistics extends object = object,
  GroupType extends string = string,
> {
  statistics: Statistics;
  defaultGroupType?: GroupType;
  parentGroups?: readonly (readonly [GroupType, string | number])[];
  possibleGroupTypes?: GroupType[];
  getChildren: (
    groupType: GroupType,
  ) =>
    | Record<
        string | number,
        OverviewRecursiveUndeterminedStatistics<Statistics, GroupType>
      >
    | undefined;
  getChildrenIds?(path: [GroupType, string | number][]): string[];
}
