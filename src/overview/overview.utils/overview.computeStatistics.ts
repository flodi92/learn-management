import { LearnSubject, TimedResult } from '../../model';
import { OverviewRecursiveUndeterminedStatistics } from './overview.computeStatistics.model';
import { SubjectStatisticsTuples } from './overview.computeStatistics.model';
import {
  ComputeAggregatedStatistics,
  ComputeSubjectStatistics,
  GetGroups,
  GroupTypeOrSubject,
} from './overview.computeStatistics.model';

class StatisticsComputation<
  Subject extends LearnSubject,
  GroupType extends string,
  SubjectStatistics extends object,
  AggregatedStatistics extends object,
> implements OverviewRecursiveUndeterminedStatistics<
  SubjectStatistics | AggregatedStatistics,
  GroupTypeOrSubject<GroupType>
> {
  constructor(
    private subjectStatisticsTuples: SubjectStatisticsTuples<
      Subject,
      SubjectStatistics
    >,
    private groupTypes: GroupType[],
    private getGroups: GetGroups<Subject, GroupType>,
    private computeAggregatedStatistics: ComputeAggregatedStatistics<
      SubjectStatistics,
      AggregatedStatistics
    >,
    public readonly parentGroups: (readonly [
      GroupType,
      string | number,
    ])[] = [],
  ) {}

  public get groupType(): GroupTypeOrSubject<GroupType> {
    return this.groupTypes.length ? this.groupTypes[0] : 'subject';
  }

  private get childrensGroupTypes() {
    return this.groupTypes.slice(1);
  }

  public get statistics(): AggregatedStatistics {
    return this.computeAggregatedStatistics(
      this.subjectStatisticsTuples.map(
        ([id, subject, progressItem]) => progressItem,
      ),
    );
  }

  get children() {
    const { groupType, childrensGroupTypes, subjectStatisticsTuples } = this;

    if (groupType === 'subject') {
      return Object.fromEntries(
        subjectStatisticsTuples.map(
          ([id, subject, progressItem]) =>
            [
              id,
              {
                groupType: 'subject',
                statistics: progressItem,
              },
            ] as const,
        ),
      );
    }

    const groupedTuples = subjectStatisticsTuples.reduce(
      (acc, tuple) => {
        const [id, subject, progressItem] = tuple;
        const groups = this.getGroups(groupType, subject);

        groups.forEach((group) => {
          if (!acc[group]) acc[group] = [];

          acc[group].push(tuple);
        });
        return acc;
      },
      {} as Record<
        string | number,
        SubjectStatisticsTuples<Subject, SubjectStatistics>
      >,
    );

    return Object.fromEntries(
      Object.entries(groupedTuples).map(([group, tuples]) => [
        group,
        new StatisticsComputation(
          tuples,
          childrensGroupTypes,
          this.getGroups,
          this.computeAggregatedStatistics,
          [...this.parentGroups, [groupType, group]],
        ),
      ]),
    );
  }

  public getChildrenIds(
    path: [GroupTypeOrSubject<GroupType>, string | number][],
  ): string[] {
    if (path.length === 0) {
      return this.subjectStatisticsTuples.map(([id]) => id);
    }

    const [[expectedGroupType, group], ...restPath] = path;

    const children: Record<
      string | number,
      OverviewRecursiveUndeterminedStatistics<
        SubjectStatistics | AggregatedStatistics,
        GroupTypeOrSubject<GroupType>
      >
    > = this.children;

    if (this.groupType !== expectedGroupType) {
      throw new Error(
        `Expected group type "${this.groupType}" but got "${expectedGroupType}"`,
      );
    }

    if (children[group] === undefined) {
      throw new Error(`No child "${group}" for group type "${this.groupType}"`);
    }

    return children[group].getChildrenIds!(restPath);
  }
}

export const computeStatistics = <
  Subject extends LearnSubject,
  GroupType extends string,
  SubjectStatistics extends object,
  AggregatedStatistics extends object,
>(
  idSubjectMapping: Record<string, Subject>,
  results: TimedResult[],
  day: number,
  getLabelFromId: (id: string) => string,
  groupTypes: GroupType[],
  getGroups: GetGroups<Subject, GroupType>,
  computeSubjectsStatistics: ComputeSubjectStatistics<
    Subject,
    SubjectStatistics
  >,
  aggregateStatistics: ComputeAggregatedStatistics<
    SubjectStatistics,
    AggregatedStatistics
  >,
): OverviewRecursiveUndeterminedStatistics<
  SubjectStatistics | AggregatedStatistics,
  GroupTypeOrSubject<GroupType>
> => {
  const statistics = computeSubjectsStatistics(
    idSubjectMapping,
    results,
    day,
    getLabelFromId,
  );
  return new StatisticsComputation(
    statistics,
    groupTypes,
    getGroups,
    aggregateStatistics,
  );
};
