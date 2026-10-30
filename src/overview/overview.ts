import { LearnSubject, TimedResult } from '../model';
import { OverviewRecursiveStatistics } from './overview.model';
import { computeStatistics } from './overview.utils/overview.computeStatistics';
import { getGroupsForRelevanceAndCategory } from './overview.utils/overview.getGroupsForRelevanceAndCategory';
import { RelevanceCategoryGroupType } from './overview.utils/overview.computeStatistics.model';
import { getToday } from '../utils';

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
    );
    this.displayComputedStatistics(statistics);
  }
  abstract askForNumberOfTasks(): Promise<number>;
  abstract showSessionFinishedView(): Promise<void>;
  protected abstract displayComputedStatistics(
    statistics: OverviewRecursiveStatistics,
  ): Promise<void>;
}
