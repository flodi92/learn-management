import { LearnSubject, TimedResult } from '../model';
import { getToday } from '../utils';
import {
  OverviewRecursiveStatistics,
  RelevanceCategoryGroupType,
} from './overview.model';
import { computeAggregatedStatistics } from './overview.utils/overview.computeAggregatedStatistics';
import { computeStatistics } from './overview.utils/overview.computeStatistics';
import { computeSubjectsStatistics } from './overview.utils/overview.computeSubjectsStatistics';
import { displaySelectableComputedStatistics } from './overview.utils/overview.displaySelectableComputedStatistics';
import { DisplayComputedStatistics } from './overview.model';
import { getGroupsForRelevanceAndCategory } from './overview.utils/overview.getGroupsForRelevanceAndCategory';

export abstract class Overview<Subject extends LearnSubject> {
  private statistics: OverviewRecursiveStatistics | undefined;

  constructor(public getLabelFromId: (id: string) => string) {}

  abstract askForNumberOfTasks(): Promise<number>;
  abstract showSessionFinishedView(): Promise<void>;

  public async displayStatistics(
    idSubjectMapping: Record<string, Subject>,
    results: TimedResult[],
    preselectedSubjects: Subject[],
  ): Promise<Subject[]> {
    this.statistics = computeStatistics(
      idSubjectMapping,
      results,
      getToday(),
      this.getLabelFromId,
      ['category', 'relevance'] satisfies RelevanceCategoryGroupType[],
      getGroupsForRelevanceAndCategory,
      computeSubjectsStatistics,
      computeAggregatedStatistics,
    );

    const selectedItems = await displaySelectableComputedStatistics(
      this.displayComputedStatistics.bind(this),
      this.statistics,
      preselectedSubjects.map(({ id }) => id),
    );

    return selectedItems.map((id) => idSubjectMapping[id]);
  }

  protected abstract displayComputedStatistics(
    ...args: Parameters<DisplayComputedStatistics>
  ): ReturnType<DisplayComputedStatistics>;
}
