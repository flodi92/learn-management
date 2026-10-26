import { computeSubjectStatisticsAt } from '../learnScheduler/learnScheduler.utils/computeSubjectStatisticsAt';
import { determineLearningStateFromStatisticsItem } from '../learnScheduler/learnScheduler.utils/determineLearningStateFromStatisticsItem';
import { LearnSubject, TimedResult } from '../model';
import { getToday } from '../utils';
import {
  ProgressAggregation,
  ProgressItem,
  GeneralStatistics,
} from './progressOverview';

const aggregateProgressItems = (
  progressItems: ProgressItem[],
): ProgressAggregation => ({
  avgLastRepetitionBeforeDays: progressItems.reduce(
    (acc, item) => acc + item.lastRepetitionBeforeDays,
    0,
  ),
  notLearned: progressItems.filter(
    (item) => item.learningState === 'notLearned',
  ).length,
  learning: progressItems.filter((item) => item.learningState === 'learning')
    .length,
  learned: progressItems.filter((item) => item.learningState === 'learned')
    .length,
  forRepeat: progressItems.filter((item) => item.learningState === 'forRepeat')
    .length,
});

const getItemStatistics = <S extends LearnSubject>(
  idSubjectMapping: Record<string, S>,
  results: TimedResult[],
  day: number,
  getLabelFromId: (id: string) => string,
) => {
  const subjectStatistics = computeSubjectStatisticsAt(
    day,
    idSubjectMapping,
    results,
  );

  return Object.entries(subjectStatistics).map(
    ([id, statisticsItem]) =>
      [
        id,
        idSubjectMapping[id],
        {
          label: getLabelFromId(id),
          mastery: statisticsItem.mastery,
          lastRepetitionBeforeDays: statisticsItem.lastRepetition
            ? day - statisticsItem.lastRepetition
            : Infinity,
          numberOfRepetitions: statisticsItem.numberOfRepetitions,
          learningState:
            determineLearningStateFromStatisticsItem(statisticsItem),
        },
      ] as ProgressTuple<S>,
  );
};

type ProgressTuple<S extends LearnSubject> = [string, S, ProgressItem];
type ProgressTuples<S extends LearnSubject> = ProgressTuple<S>[];
class ComputeData<S extends LearnSubject> implements GeneralStatistics {
  constructor(
    private progressTuples: ProgressTuples<S>,
    private childTypes: ('relevance' | 'category')[],
  ) {}

  public get childType() {
    return this.childTypes.length ? this.childTypes[0] : undefined;
  }

  private get childrensChildTypes() {
    return this.childTypes.length ? this.childTypes.slice(1) : undefined;
  }

  public get statistics() {
    return aggregateProgressItems(
      this.progressTuples.map(([id, subject, progressItem]) => progressItem),
    );
  }

  get children() {
    const { childType, childrensChildTypes } = this;

    if (childType === undefined || childrensChildTypes === undefined) {
      return Object.fromEntries(
        this.progressTuples.map(
          ([id, subject, progressItem]) =>
            [id, { statistics: progressItem }] as const,
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
