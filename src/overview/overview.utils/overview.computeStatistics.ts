import { LearnSubject, TimedResult } from '../../model';
import { getToday } from '../../utils';
import {
  OverviewRecursiveStatistics,
  SubjectStatisticsTuples,
} from '../overview.model';
import { computeAggregatedStatistics } from './overview.computeAggregatedStatistics';
import { computeSubjectsStatistics } from './overview.computeSubjectsStatistics';

class StatisticsComputation<
  S extends LearnSubject,
> implements OverviewRecursiveStatistics {
  constructor(
    private subjectStatisticsTuples: SubjectStatisticsTuples<S>,
    private childTypes: ('relevance' | 'category')[],
  ) {}

  public get childType(): 'relevance' | 'category' | 'subject' {
    return this.childTypes.length ? this.childTypes[0] : 'subject';
  }

  private get childrensChildTypes() {
    return this.childTypes.slice(1);
  }

  public get statistics() {
    return computeAggregatedStatistics(
      this.subjectStatisticsTuples.map(
        ([id, subject, progressItem]) => progressItem,
      ),
    );
  }

  get children() {
    const { childType, childrensChildTypes } = this;

    if (childType === 'subject') {
      return Object.fromEntries(
        this.subjectStatisticsTuples.map(
          ([id, subject, progressItem]) =>
            [id, { childType: 'subject', statistics: progressItem }] as const,
        ),
      );
    }

    const groupedTuples = this.subjectStatisticsTuples.reduce(
      (acc, tuple) => {
        const [id, subject, progressItem] = tuple;
        const groups =
          childType === 'category'
            ? (subject.categories ?? [])
            : [subject.relevance ?? 1];
        groups.forEach((group) => {
          if (!acc[group]) acc[group] = [];

          acc[group].push(tuple);
        });
        return acc;
      },
      {} as Record<string | number, SubjectStatisticsTuples<S>>,
    );

    return Object.fromEntries(
      Object.entries(groupedTuples).map(([group, tuple]) => [
        group,
        new StatisticsComputation(tuple, childrensChildTypes),
      ]),
    );
  }
}

export const computeStatistics = <S extends LearnSubject>(
  idSubjectMapping: Record<string, S>,
  results: TimedResult[],
  day: number = getToday(),
  getLabelFromId: (id: string) => string,
): OverviewRecursiveStatistics => {
  const statistics = computeSubjectsStatistics(
    idSubjectMapping,
    results,
    day,
    getLabelFromId,
  );
  return new StatisticsComputation(statistics, ['category', 'relevance']);
};
