import { LearnSubject, TimedResult } from '../../model';
import {
  OverviewRecursiveUndeterminedStatistics,
  SubjectStatisticsTuples,
} from '../overview.model';
import {
  ComputeAggregatedStatistics,
  GetGroups,
  GroupTypeOrSubject,
} from './overview.computeStatistics.model';
import { computeSubjectsStatistics } from './overview.computeSubjectsStatistics';

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
        new StatisticsComputation<
          Subject,
          GroupType,
          SubjectStatistics,
          AggregatedStatistics
        >(
          tuples,
          childrensGroupTypes,
          this.getGroups,
          this.computeAggregatedStatistics,
          [...this.parentGroups, [groupType, group]],
        ),
      ]),
    );
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
  return new StatisticsComputation<
    Subject,
    GroupType,
    SubjectStatistics,
    AggregatedStatistics
  >(
    statistics as SubjectStatisticsTuples<Subject, SubjectStatistics>,
    groupTypes,
    getGroups,
    aggregateStatistics,
  );
};
