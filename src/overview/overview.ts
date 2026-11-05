import { LearnSubject, TimedResult } from '../model';
import { getToday } from '../utils';
import { RelevanceCategoryGroupType } from './overview.model';
import { computeAggregatedStatistics } from './overview.utils/overview.computeAggregatedStatistics';
import { computeStatistics } from './overview.utils/overview.computeStatistics';
import { computeSubjectsStatistics } from './overview.utils/overview.computeSubjectsStatistics';
import { displaySelectableComputedStatistics } from './overview.utils/overview.displaySelectableComputedStatistics';
import { DisplayComputedStatistics } from './overview.model';
import { getGroupsForRelevanceAndCategory } from './overview.utils/overview.getGroupsForRelevanceAndCategory';
import { getSelectionKey } from './overview.utils/overview.getSelectionKey';

export abstract class Overview<Subject extends LearnSubject> {
  constructor(public getLabelFromId: (id: string) => string) {}

  abstract askForNumberOfTasks(): Promise<number>;
  abstract showSessionFinishedView(): Promise<void>;

  public async displayStatistics(
    idSubjectMapping: Record<string, Subject>,
    results: TimedResult[],
    preselectedSubjects: Subject[],
  ): Promise<Subject[]> {
    const selectedItems = await displaySelectableComputedStatistics(
      this.displayComputedStatistics.bind(this),
      (getSelectedIds, getGroupSelection) =>
        computeStatistics(
          idSubjectMapping,
          results,
          getToday(),
          this.getLabelFromId,
          ['category', 'relevance'] satisfies RelevanceCategoryGroupType[],
          getGroupsForRelevanceAndCategory,
          computeSubjectsStatistics,
          computeAggregatedStatistics,
          getSelectedIds,
          (parentGroups) => getGroupSelection()[getSelectionKey(parentGroups)],
        ),
      preselectedSubjects.map(({ id }) => id),
    );

    return selectedItems.map((id) => idSubjectMapping[id]);
  }

  protected abstract displayComputedStatistics(
    ...args: Parameters<DisplayComputedStatistics>
  ): ReturnType<DisplayComputedStatistics>;
}
