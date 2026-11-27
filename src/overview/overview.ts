import { TaskDescription, TimedResult } from '../model';
import { OverviewGroupType } from './overview.model';
import { computeAggregatedStatistics } from './overview.utils/overview.computeAggregatedStatistics';
import { computeStatistics } from './overview.utils/overview.computeStatistics';
import { computeTaskDescriptionsStatistics } from './overview.utils/overview.computeTaskDescriptionsStatistics';
import { displaySelectableComputedStatistics } from './overview.utils/overview.displaySelectableComputedStatistics';
import { DisplayComputedStatistics } from './overview.model';
import { getOverviewGroups } from './overview.utils/overview.getOverviewGroups';
import { getSelectionKey } from './overview.utils/overview.getSelectionKey';

export abstract class Overview<TD extends TaskDescription> {
  constructor(public getLabelFromId: (id: string) => string) {}

  abstract askForNumberOfTaskDescriptions(): Promise<number>;
  abstract showSessionFinishedView(): Promise<void>;

  public async displayStatistics(
    idTaskDescriptionMapping: Record<string, TD>,
    results: TimedResult[],
    preselectedTaskDescriptions: TD[],
  ): Promise<TD[]> {
    const selectedItems = await displaySelectableComputedStatistics(
      this.displayComputedStatistics.bind(this),
      (getSelectedIds, getGroupSelection) =>
        computeStatistics(
          idTaskDescriptionMapping,
          results,
          Date.now(),
          this.getLabelFromId,
          ['category', 'relevance', 'subject'] satisfies OverviewGroupType[],
          [
            'complexity',
            'learningState',
            'selectionState',
          ] satisfies OverviewGroupType[],
          getOverviewGroups,
          computeTaskDescriptionsStatistics,
          computeAggregatedStatistics,
          getSelectedIds,
          (parentGroups) => getGroupSelection()[getSelectionKey(parentGroups)],
        ),
      preselectedTaskDescriptions.map(({ id }) => id),
    );

    return selectedItems.map((id) => idTaskDescriptionMapping[id]);
  }

  protected abstract displayComputedStatistics(
    ...args: Parameters<DisplayComputedStatistics>
  ): ReturnType<DisplayComputedStatistics>;
}
