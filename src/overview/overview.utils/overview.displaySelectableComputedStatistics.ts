import {
  CreateComputedStatistics,
  DisplayComputedStatistics,
  OverviewGroupSelection,
  OverviewRecursiveStatistics,
  OverviewSelectionKey,
  OverviewSelectionPath,
  OverviewTaskDescriptionSelection,
} from '../overview.model';
import { getSelectionKey } from './overview.getSelectionKey';
import { isTaskDescriptionSelectionPath } from './overview.isTaskDescriptionSelectionPath';

export class OverviewDisplaySelectableComputedStatistics {
  private statistics: OverviewRecursiveStatistics;
  private groupSelection: OverviewGroupSelection;
  private taskDescriptionSelection: OverviewTaskDescriptionSelection = {};

  constructor(
    createStatistics: CreateComputedStatistics,
    private displayComputedStatistics: DisplayComputedStatistics,
    preselectedTaskDescriptionIds: string[],
  ) {
    this.statistics = createStatistics(
      () => this.selectedItems,
      () => this.groupSelection,
    );
    this.groupSelection = Object.fromEntries(
      preselectedTaskDescriptionIds.map((id) => [
        getSelectionKey([['taskDescription', id]]),
        true,
      ]),
    );
    this.updateTaskDescriptionSelection();
  }

  public async display(): Promise<string[]> {
    await this.displayComputedStatistics(
      this.statistics,
      this.toggleSelection.bind(this),
      () => this.taskDescriptionSelection,
    );

    return this.selectedItems;
  }

  private get selectedItems() {
    return Object.entries(this.taskDescriptionSelection)
      .filter(([, selected]) => selected)
      .map(([id]) => id);
  }

  private toggleSelection(path: OverviewSelectionPath) {
    if (path.some(([groupType]) => groupType === 'selectionState')) {
      this.toggleSelectionOfCurrentMembers(path);
      return;
    }

    const pathStr = getSelectionKey(path);
    const selected = this.groupSelection[pathStr];
    delete this.groupSelection[pathStr];

    if (isTaskDescriptionSelectionPath(path)) {
      this.groupSelection[pathStr] = selected === true ? undefined : true;
    } else {
      this.groupSelection[pathStr] =
        selected === undefined ? true : selected === true ? false : undefined;
    }

    this.updateTaskDescriptionSelection();
  }

  // The members of a selectionState group change with every selection, so a group selection could not be resolved again later.
  // Instead the taskDescriptions that are members right now are (un)selected individually.
  private toggleSelectionOfCurrentMembers(path: OverviewSelectionPath) {
    const ids = this.statistics.getChildrenIds!(path);
    const select = ids.some((id) => !this.taskDescriptionSelection[id]);

    ids.forEach((id) => {
      const pathStr = getSelectionKey([['taskDescription', id]]);
      delete this.groupSelection[pathStr];
      this.groupSelection[pathStr] = select ? true : undefined;
    });

    this.updateTaskDescriptionSelection();
  }

  private updateTaskDescriptionSelection() {
    this.taskDescriptionSelection = (
      Object.entries(this.groupSelection) as [
        OverviewSelectionKey,
        boolean | undefined,
      ][]
    ).reduce((acc, [pathStr, selected]) => {
      const path = JSON.parse(pathStr) as OverviewSelectionPath;

      if (isTaskDescriptionSelectionPath(path)) {
        acc[path[path.length - 1][1]] = selected ? true : undefined;
      } else if (selected !== undefined) {
        this.statistics.getChildrenIds!(path).forEach((id) => {
          acc[id] = selected ? true : undefined;
        });
      }

      return acc;
    }, {} as OverviewTaskDescriptionSelection);
  }
}

export const displaySelectableComputedStatistics = (
  displayComputedStatistics: DisplayComputedStatistics,
  createStatistics: CreateComputedStatistics,
  preselectedTaskDescriptionIds: string[],
) =>
  new OverviewDisplaySelectableComputedStatistics(
    createStatistics,
    displayComputedStatistics,
    preselectedTaskDescriptionIds,
  ).display();
