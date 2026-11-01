import { LearnSubject, TimedResult } from '../model';
import { getToday } from '../utils';
import { OverviewRecursiveStatistics } from './overview.model';
import { computeAggregatedStatistics } from './overview.utils/overview.computeAggregatedStatistics';
import { computeStatistics } from './overview.utils/overview.computeStatistics';
import { RelevanceCategoryGroupType } from './overview.utils/overview.computeStatistics.model';
import { computeSubjectsStatistics } from './overview.utils/overview.computeSubjectsStatistics';
import { getGroupsForRelevanceAndCategory } from './overview.utils/overview.getGroupsForRelevanceAndCategory';

export abstract class Overview {
  constructor(public getLabelFromId: (id: string) => string) {}
  async displayStatistics(
    idSubjectMapping: Record<string, LearnSubject>,
    results: TimedResult[],
  ): Promise<void> {
    const statistics = computeStatistics(
      idSubjectMapping,
      results,
      getToday(),
      this.getLabelFromId,
      ['category', 'relevance'] satisfies RelevanceCategoryGroupType[],
      getGroupsForRelevanceAndCategory,
      computeSubjectsStatistics,
      computeAggregatedStatistics,
    );
    this.displayComputedStatistics(statistics);
  }
  abstract askForNumberOfTasks(): Promise<number>;
  abstract showSessionFinishedView(): Promise<void>;
  protected abstract displayComputedStatistics(
    statistics: OverviewRecursiveStatistics,
  ): Promise<void>;
}
