import { TaskDescription, TimedResult } from '../../model';
import { OverviewRecursiveUndeterminedStatistics } from './overview.computeStatistics.model';
import { TaskDescriptionStatisticsTuples } from './overview.computeStatistics.model';
import {
  ComputeAggregatedStatistics,
  ComputeTaskDescriptionStatistics,
  GetGroups,
  GroupTypeOrTaskDescription,
} from './overview.computeStatistics.model';

class StatisticsComputation<
  TD extends TaskDescription,
  GroupType extends string,
  TaskDescriptionStatistics extends object,
  AggregatedStatistics extends object,
> implements OverviewRecursiveUndeterminedStatistics<
  TaskDescriptionStatistics | AggregatedStatistics,
  GroupTypeOrTaskDescription<GroupType>
> {
  constructor(
    private taskDescriptionStatisticsTuples: TaskDescriptionStatisticsTuples<
      TD,
      TaskDescriptionStatistics
    >,
    private groupTypes: GroupType[],
    private optionalGroupTypes: GroupType[],
    private getGroups: GetGroups<TD, TaskDescriptionStatistics, GroupType>,
    private computeAggregatedStatistics: ComputeAggregatedStatistics<
      TaskDescriptionStatistics,
      AggregatedStatistics
    >,
    private getSelectedIds: () => string[],
    private getGroupSelection: (
      parentGroups: readonly (readonly [GroupType, string | number])[],
    ) => boolean | undefined,
    public readonly parentGroups: (readonly [
      GroupType,
      string | number,
    ])[] = [],
  ) {}

  public get defaultGroupType(): GroupTypeOrTaskDescription<GroupType> {
    return this.groupTypes.length ? this.groupTypes[0] : 'taskDescription';
  }

  public get statistics(): AggregatedStatistics {
    return this.computeAggregatedStatistics(
      this.taskDescriptionStatisticsTuples.map(
        ([id, taskDescription, progressItem]) => progressItem,
      ),
      this.getSelectedIds(),
      this.getGroupSelection(this.parentGroups),
    );
  }

  public get possibleGroupTypes(): GroupTypeOrTaskDescription<GroupType>[] {
    return [...this.groupTypes, ...this.optionalGroupTypes, 'taskDescription'];
  }

  private cachedChildren = new Map<
    GroupTypeOrTaskDescription<GroupType>,
    Record<
      string | number,
      OverviewRecursiveUndeterminedStatistics<
        TaskDescriptionStatistics | AggregatedStatistics,
        GroupTypeOrTaskDescription<GroupType>
      >
    >
  >();

  // The groups of a group type can depend on the selection, so the cache is only valid for the selection it was filled with.
  private cachedSelectionKey?: string;

  public getChildren(
    groupType: GroupTypeOrTaskDescription<GroupType>,
  ): Record<
    string | number,
    OverviewRecursiveUndeterminedStatistics<
      TaskDescriptionStatistics | AggregatedStatistics,
      GroupTypeOrTaskDescription<GroupType>
    >
  > {
    const selectionKey = JSON.stringify([...this.getSelectedIds()].sort());
    if (selectionKey !== this.cachedSelectionKey) {
      this.cachedChildren.clear();
      this.cachedSelectionKey = selectionKey;
    }
    let children = this.cachedChildren.get(groupType);
    if (!children) {
      children = this.computeChildren(groupType);
      this.cachedChildren.set(groupType, children);
    }
    return children;
  }

  private computeChildren(groupType = this.defaultGroupType) {
    const { taskDescriptionStatisticsTuples } = this;

    if (groupType === 'taskDescription') {
      return Object.fromEntries(
        taskDescriptionStatisticsTuples.map(
          ([id, taskDescription, progressItem]) =>
            [
              id,
              {
                groupType: 'taskDescription',
                statistics: progressItem,
                getChildren: () => undefined,
              },
            ] as const,
        ),
      );
    }

    if (!this.possibleGroupTypes.includes(groupType)) {
      throw new Error(`Unknown group type "${groupType}"`);
    }
    const childrensGroupTypes = this.groupTypes.filter(
      (type) => type !== groupType,
    );
    const childrensOptionalGroupTypes = this.optionalGroupTypes.filter(
      (type) => type !== groupType,
    );

    const selectedIds = this.getSelectedIds();
    const groupedTuples = taskDescriptionStatisticsTuples.reduce(
      (acc, tuple) => {
        const [id, taskDescription, progressItem] = tuple;
        const groups = this.getGroups(
          groupType,
          taskDescription,
          progressItem,
          selectedIds,
        );

        groups.forEach((group) => {
          if (!acc[group]) acc[group] = [];

          acc[group].push(tuple);
        });
        return acc;
      },
      {} as Record<
        string | number,
        TaskDescriptionStatisticsTuples<TD, TaskDescriptionStatistics>
      >,
    );

    return Object.fromEntries(
      Object.entries(groupedTuples).map(([group, tuples]) => [
        group,
        new StatisticsComputation(
          tuples,
          childrensGroupTypes,
          childrensOptionalGroupTypes,
          this.getGroups,
          this.computeAggregatedStatistics,
          this.getSelectedIds,
          this.getGroupSelection,
          [...this.parentGroups, [groupType, group]],
        ),
      ]),
    );
  }

  public getChildrenIds(
    path: [GroupTypeOrTaskDescription<GroupType>, string | number][],
  ): string[] {
    if (path.length === 0) {
      return this.taskDescriptionStatisticsTuples.map(([id]) => id);
    }

    const [[groupType, group], ...restPath] = path;

    if (groupType === 'taskDescription') {
      if (restPath.length > 0) {
        throw new Error('A taskDescription has no children');
      }
      return [String(group)];
    }

    const child = this.getChildren(groupType)[group];

    if (child === undefined) {
      throw new Error(`No child "${group}" for group type "${groupType}"`);
    }

    return child.getChildrenIds!(restPath);
  }
}

export const computeStatistics = <
  TD extends TaskDescription,
  GroupType extends string,
  TaskDescriptionStatistics extends object,
  AggregatedStatistics extends object,
>(
  idTaskDescriptionMapping: Record<string, TD>,
  results: TimedResult[],
  day: number,
  getLabelFromId: (id: string) => string,
  groupTypes: GroupType[],
  optionalGroupTypes: GroupType[],
  getGroups: GetGroups<TD, TaskDescriptionStatistics, GroupType>,
  computeTaskDescriptionsStatistics: ComputeTaskDescriptionStatistics<
    TD,
    TaskDescriptionStatistics
  >,
  aggregateStatistics: ComputeAggregatedStatistics<
    TaskDescriptionStatistics,
    AggregatedStatistics
  >,
  getSelectedIds: () => string[],
  getGroupSelection: (
    parentGroups: readonly (readonly [GroupType, string | number])[],
  ) => boolean | undefined,
): OverviewRecursiveUndeterminedStatistics<
  TaskDescriptionStatistics | AggregatedStatistics,
  GroupTypeOrTaskDescription<GroupType>
> => {
  const statistics = computeTaskDescriptionsStatistics(
    idTaskDescriptionMapping,
    results,
    day,
    getLabelFromId,
  );
  return new StatisticsComputation(
    statistics,
    groupTypes,
    optionalGroupTypes,
    getGroups,
    aggregateStatistics,
    getSelectedIds,
    getGroupSelection,
  );
};
