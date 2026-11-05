import {
  DisplayComputedStatistics,
  OverviewGroupSelection,
  OverviewRecursiveStatistics,
  OverviewSelectionKey,
  OverviewSelectionPath,
  OverviewSubjectSelection,
} from '../overview.model';
import { getSelectionKey } from './overview.getSelectionKey';

export class OverviewDisplaySelectableComputedStatistics {
  private groupSelection: OverviewGroupSelection;
  private subjectSelection: OverviewSubjectSelection = {};

  constructor(
    private statistics: OverviewRecursiveStatistics,
    private displayComputedStatistics: DisplayComputedStatistics,
    preselectedSubjectIds: string[],
  ) {
    this.groupSelection = Object.fromEntries(
      preselectedSubjectIds.map((id) => [
        getSelectionKey([['subject', id]]),
        true,
      ]),
    );
    this.updateSubjectSelection();
  }

  public async display(): Promise<string[]> {
    await this.displayComputedStatistics(
      this.statistics,
      this.toggleSelection.bind(this),
      () => this.groupSelection,
      () => this.subjectSelection,
      () => this.numberOfSelectedItems,
    );

    return this.selectedItems;
  }

  private get selectedItems() {
    return Object.entries(this.subjectSelection)
      .filter(([, selected]) => selected)
      .map(([id]) => id);
  }

  private get numberOfSelectedItems() {
    return this.selectedItems.length;
  }

  private toggleSelection(path: OverviewSelectionPath) {
    const pathStr = getSelectionKey(path);
    this.groupSelection[pathStr] =
      this.groupSelection[pathStr] === undefined
        ? true
        : this.groupSelection[pathStr] === true
          ? false
          : undefined;

    this.updateSubjectSelection();
  }

  private updateSubjectSelection() {
    const entries = (
      Object.entries(this.groupSelection) as [
        OverviewSelectionKey,
        boolean | undefined,
      ][]
    ).map(
      ([pathStr, selected]) =>
        [JSON.parse(pathStr) as OverviewSelectionPath, selected] as const,
    );

    const [subjectSelection, pureGroupSelection] = entries.reduce(
      (acc, entry): [typeof entries, typeof entries] => {
        const [subjectSelection, pureGroupSelection] = acc;
        const [path] = entry;
        const [lastGroupType] = path[path.length - 1];

        return lastGroupType === 'subject'
          ? [[...subjectSelection, entry], pureGroupSelection]
          : [subjectSelection, [...pureGroupSelection, entry]];
      },
      [[], []] as [typeof entries, typeof entries],
    );

    const sortedPureGroupSelection = pureGroupSelection.sort(
      ([pathA], [pathB]) => pathA.length - pathB.length,
    );

    this.subjectSelection = sortedPureGroupSelection.reduce(
      (acc, [path, selected]) => {
        const childrenIds = this.statistics.getChildrenIds!(path);

        childrenIds.forEach((id) => {
          if (selected === true) {
            acc[id] = true;
          }
        });

        return acc;
      },
      {} as OverviewSubjectSelection,
    );

    this.subjectSelection = subjectSelection.reduce((acc, [path, selected]) => {
      const [, lastId] = path[path.length - 1];
      acc[lastId] = selected ? true : undefined;
      return acc;
    }, this.subjectSelection);

    this.subjectSelection = sortedPureGroupSelection
      .reverse()
      .reduce((acc, [path, selected]) => {
        const childrenIds = this.statistics.getChildrenIds!(path);

        childrenIds.forEach((id) => {
          if (selected === false) {
            acc[id] = undefined;
          }
        });

        return acc;
      }, this.subjectSelection);
  }
}

export const displaySelectableComputedStatistics = (
  displayComputedStatistics: DisplayComputedStatistics,
  statistics: OverviewRecursiveStatistics,
  preselectedSubjectIds: string[],
) =>
  new OverviewDisplaySelectableComputedStatistics(
    statistics,
    displayComputedStatistics,
    preselectedSubjectIds,
  ).display();
