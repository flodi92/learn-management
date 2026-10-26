import { LearnSubject, TimedResult } from '../../model';
import { getToday } from '../../utils';
import { GeneralStatistics, ProgressTuples } from '../progressOverview.model';
import { aggregateProgressItems } from './progressOverview.aggregateProgressItems';
import { getItemStatistics } from './progressOverview.getItemStatistics';

class ComputeData<S extends LearnSubject> implements GeneralStatistics {
  constructor(
    private progressTuples: ProgressTuples<S>,
    private childTypes: ('relevance' | 'category')[],
  ) {}

  public get childType(): 'relevance' | 'category' | 'subject' {
    return this.childTypes.length ? this.childTypes[0] : 'subject';
  }

  private get childrensChildTypes() {
    return this.childTypes.slice(1);
  }

  public get statistics() {
    return aggregateProgressItems(
      this.progressTuples.map(([id, subject, progressItem]) => progressItem),
    );
  }

  get children() {
    const { childType, childrensChildTypes } = this;

    if (childType === 'subject') {
      return Object.fromEntries(
        this.progressTuples.map(
          ([id, subject, progressItem]) =>
            [id, { childType: 'subject', statistics: progressItem }] as const,
        ),
      );
    }

    const groupedTuples = this.progressTuples.reduce(
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
      {} as Record<string | number, ProgressTuples<S>>,
    );

    return Object.fromEntries(
      Object.entries(groupedTuples).map(([group, tuple]) => [
        group,
        new ComputeData(tuple, childrensChildTypes),
      ]),
    );
  }
}

export const computeData = <S extends LearnSubject>(
  idSubjectMapping: Record<string, S>,
  results: TimedResult[],
  day: number = getToday(),
  getLabelFromId: (id: string) => string,
): GeneralStatistics => {
  const statistics = getItemStatistics(
    idSubjectMapping,
    results,
    day,
    getLabelFromId,
  );
  return new ComputeData(statistics, ['category', 'relevance']);
};
