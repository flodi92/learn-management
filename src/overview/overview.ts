import { LearnSubject, TimedResult } from '../model';
import {
  OverviewRecursiveStatistics,
  OverviewSubjectStatisticsItem,
} from './overview.model';
import { computeStatistics } from './overview.utils/overview.computeStatistics';
import { computeAggregatedStatistics } from './overview.utils/overview.computeAggregatedStatistics';
import { getGroupsForRelevanceAndCategory } from './overview.utils/overview.getGroupsForRelevanceAndCategory';
import { RelevanceCategoryGroupType } from './overview.utils/overview.computeStatistics.model';
import { getToday } from '../utils';

export abstract class Overview {
  constructor(public getLabelFromId: (id: string) => string) {}
  async displayStatistics(
    idSubjectMapping: Record<string, LearnSubject>,
    results: TimedResult[],
  ): Promise<void> {
    const statistics = computeStatistics<
      LearnSubject,
      RelevanceCategoryGroupType,
      OverviewSubjectStatisticsItem,
      ReturnType<typeof computeAggregatedStatistics>
    >(
      idSubjectMapping,
      results,
      getToday(),
      this.getLabelFromId,
      ['category', 'relevance'] satisfies RelevanceCategoryGroupType[],
      getGroupsForRelevanceAndCategory,
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
