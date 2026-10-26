import { LearnSubject, TimedResult } from '../model';
import { OverviewRecursiveStatistics } from './overview.model';
import { computeStatistics } from './overview.utils/overview.computeStatistics';
import { getToday } from '../utils';

export abstract class Overview {
  async displayStatistics(
    idSubjectMapping: Record<string, LearnSubject>,
    results: TimedResult[],
  ): Promise<void> {
    const statistics = computeStatistics(
      idSubjectMapping,
      results,
      getToday(),
      (id) => id,
    );
    this.displayComputedStatistics(statistics);
  }
  abstract askForNumberOfTasks(): Promise<number>;
  abstract showSessionFinishedView(): Promise<void>;
  protected abstract displayComputedStatistics(
    statistics: OverviewRecursiveStatistics,
  ): Promise<void>;
}
