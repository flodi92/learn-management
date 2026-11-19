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
    const pathStr = getSelectionKey(path);
    const selected = this.groupSelection[pathStr];

    if (isTaskDescriptionSelectionPath(path)) {
      this.groupSelection[pathStr] = selected === true ? undefined : true;
    } else {
      this.groupSelection[pathStr] =
        selected === undefined ? true : selected === true ? false : undefined;
    }

    this.updateTaskDescriptionSelection();
  }

  private updateTaskDescriptionSelection() {
    const entries = (
      Object.entries(this.groupSelection) as [
        OverviewSelectionKey,
        boolean | undefined,
      ][]
    ).map(
      ([pathStr, selected]) =>
        [JSON.parse(pathStr) as OverviewSelectionPath, selected] as const,
    );

    const [taskDescriptionSelection, pureGroupSelection] = entries.reduce(
      (acc, entry): [typeof entries, typeof entries] => {
        const [taskDescriptionSelection, pureGroupSelection] = acc;
        const [path] = entry;
        const [lastGroupType] = path[path.length - 1];

        return lastGroupType === 'taskDescription'
          ? [[...taskDescriptionSelection, entry], pureGroupSelection]
          : [taskDescriptionSelection, [...pureGroupSelection, entry]];
      },
      [[], []] as [typeof entries, typeof entries],
    );

    const sortedPureGroupSelection = pureGroupSelection.sort(
      ([pathA], [pathB]) => pathA.length - pathB.length,
    );

    this.taskDescriptionSelection = sortedPureGroupSelection.reduce(
      (acc, [path, selected]) => {
        const childrenIds = this.statistics.getChildrenIds!(path);

        childrenIds.forEach((id) => {
          if (selected === true) {
            acc[id] = true;
          }
        });

        return acc;
      },
      {} as OverviewTaskDescriptionSelection,
    );

    this.taskDescriptionSelection = taskDescriptionSelection.reduce(
      (acc, [path, selected]) => {
        const [, lastId] = path[path.length - 1];
        acc[lastId] = selected ? true : undefined;
        return acc;
      },
      this.taskDescriptionSelection,
    );

    this.taskDescriptionSelection = sortedPureGroupSelection
      .reverse()
      .reduce((acc, [path, selected]) => {
        const childrenIds = this.statistics.getChildrenIds!(path);

        childrenIds.forEach((id) => {
          if (selected === false) {
            acc[id] = undefined;
          }
        });

        return acc;
      }, this.taskDescriptionSelection);
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
