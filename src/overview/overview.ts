import { LearnSubject, TimedResult } from '../model';
import { getToday } from '../utils';
import {
  OverviewRecursiveStatistics,
  RelevanceCategoryGroupType,
} from './overview.model';
import { computeAggregatedStatistics } from './overview.utils/overview.computeAggregatedStatistics';
import { computeStatistics } from './overview.utils/overview.computeStatistics';
import { computeSubjectsStatistics } from './overview.utils/overview.computeSubjectsStatistics';
import { getGroupsForRelevanceAndCategory } from './overview.utils/overview.getGroupsForRelevanceAndCategory';

export abstract class Overview {
  private statistics: OverviewRecursiveStatistics | undefined;
  private groupSelection: Record<string, boolean | undefined> = {};
  private subjectSelection: Record<string, true | undefined> = {};

  constructor(public getLabelFromId: (id: string) => string) {}

  abstract askForNumberOfTasks(): Promise<number>;
  abstract showSessionFinishedView(): Promise<void>;

  public async displayStatistics(
    idSubjectMapping: Record<string, LearnSubject>,
    results: TimedResult[],
  ): Promise<void> {
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
    await this.displayComputedStatistics(
      this.statistics,
      this.toggleSelection.bind(this),
      () => this.groupSelection,
      () => this.subjectSelection,
    );
  }

  protected abstract displayComputedStatistics(
    statistics: OverviewRecursiveStatistics,
    toggleSelection: (path: [string, string | number][]) => void,
    groupSelection: () => Record<string, boolean | undefined>,
    subjectSelection: () => Record<string, true | undefined>,
  ): Promise<void>;

  private toggleSelection(path: [string, string | number][]) {
    const pathStr = JSON.stringify(path);
    this.groupSelection[pathStr] =
      this.groupSelection[pathStr] === undefined
        ? true
        : this.groupSelection[pathStr] === true
          ? false
          : undefined;

    this.updateSubjectSelection();
  }

  private updateSubjectSelection() {
    if (!this.statistics) return;

    const entries = Object.entries(this.groupSelection)
      .map(
        ([pathStr, selected]) =>
          [
            JSON.parse(pathStr) as [
              RelevanceCategoryGroupType,
              string | number,
            ][],
            selected,
          ] as const,
      )
      .sort(([pathA], [pathB]) => pathA.length - pathB.length);

    this.subjectSelection = entries.reduce(
      (acc, [path, selected]) => {
        const childrenIds = this.statistics!.getChildrenIds!(path);

        childrenIds.forEach((id) => {
          acc[id] = selected ? true : undefined;
        });

        return acc;
      },
      {} as Record<string, true | undefined>,
    );
  }
}
