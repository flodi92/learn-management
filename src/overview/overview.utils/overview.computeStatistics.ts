import { LearnSubject, TimedResult } from '../../model';
import {
  OverviewRecursiveStatistics,
  SubjectStatisticsTuples,
} from '../overview.model';
import { computeAggregatedStatistics } from './overview.computeAggregatedStatistics';
import {
  GetGroups,
  GroupTypeOrSubject,
} from './overview.computeStatistics.model';
import { computeSubjectsStatistics } from './overview.computeSubjectsStatistics';

class StatisticsComputation<
  Subject extends LearnSubject,
  GroupType extends string,
> implements OverviewRecursiveStatistics {
  constructor(
    private subjectStatisticsTuples: SubjectStatisticsTuples<Subject>,
    private groupTypes: GroupType[],
    private getGroups: GetGroups<Subject, GroupType>,
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

  public get statistics() {
    return computeAggregatedStatistics(
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
            [id, { groupType: 'subject', statistics: progressItem }] as const,
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
      {} as Record<string | number, SubjectStatisticsTuples<Subject>>,
    );

    return Object.fromEntries(
      Object.entries(groupedTuples).map(([group, tuples]) => [
        group,
        new StatisticsComputation(tuples, childrensGroupTypes, this.getGroups, [
          ...this.parentGroups,
          [groupType, group],
        ]),
      ]),
    );
  }
}

export const computeStatistics = <
  S extends LearnSubject,
  GroupType extends string,
>(
  idSubjectMapping: Record<string, S>,
  results: TimedResult[],
  day: number,
  getLabelFromId: (id: string) => string,
  groupTypes: GroupType[],
  getGroups: GetGroups<S, GroupType>,
): OverviewRecursiveStatistics => {
  const statistics = computeSubjectsStatistics(
    idSubjectMapping,
    results,
    day,
    getLabelFromId,
  );
  return new StatisticsComputation(statistics, groupTypes, getGroups);
};
