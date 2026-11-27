import readline from 'node:readline';
import {
  OverviewGroupTypeOrTaskDescription,
  OverviewSelectionPath,
  OverviewTaskDescriptionSelection,
} from '../../../overview/overview.model';
import { OverviewRecursiveUndeterminedStatistics } from '../../../overview/overview.utils/overview.computeStatistics.model';
import {
  ellipsis,
  focusPointerColor,
  headingColor,
  helpColor,
  inactiveColor,
  numberOfInitiallyShownChildren,
  selectionStateIndicators,
} from '../console.constants';
import { camelCaseToWords } from '../console.displayStatisticsItem.utils/console.formatStatistics';
import {
  Focus,
  Line,
  StatisticsColorer,
  StatisticsDetailsFormatter,
  StatisticsFormatter,
  StatisticsPath,
  StatisticsSorter,
} from './console.displayStatistics.model';
import {
  focusId,
  getDisplayName,
  getLineFocus,
  getNextGroupType,
  getNode,
  getSelectableGroupTypes,
  getSortedChildren,
  getTaskDescriptionOrGroupSelectionPath,
  indentation,
  isHighlighted,
  pathId,
} from './console.displayStatistics.utils';

type TaskDescriptionSelection = () => OverviewTaskDescriptionSelection;

type Node<Statistics extends object> = OverviewRecursiveUndeterminedStatistics<
  Statistics,
  OverviewGroupTypeOrTaskDescription
>;

export class ConsoleDisplayStatistics<Statistics extends object> {
  private root?: Node<Statistics>;
  private groupTypes = new Map<string, OverviewGroupTypeOrTaskDescription>();
  private expanded = new Set<string>();
  private shownChildren = new Map<string, number>();
  private lines: Line<Statistics>[] = [];
  private focus?: Focus;
  private resolveDisplay?: () => void;
  private readonly showSelectionIndicators: boolean;
  private readonly taskDescriptionSelection: TaskDescriptionSelection;

  constructor(
    private readonly formatStatistics: StatisticsFormatter<Statistics>,
    private readonly formatStatisticsDetails: StatisticsDetailsFormatter<Statistics>,
    private readonly getStatisticsColor: StatisticsColorer<Statistics>,
    private readonly sortChildren: StatisticsSorter<Statistics>,
    private readonly toggleSelection: (
      path: OverviewSelectionPath,
    ) => void = () => {},
    taskDescriptionSelection?: TaskDescriptionSelection,
  ) {
    this.showSelectionIndicators = taskDescriptionSelection !== undefined;
    this.taskDescriptionSelection = taskDescriptionSelection ?? (() => ({}));
  }

  public display(statistics: Node<Statistics>): Promise<void> {
    return new Promise<void>((resolve) => {
      this.resolveDisplay = resolve;
      this.root = statistics;
      this.expanded.clear();
      this.shownChildren.clear();
      this.groupTypes.clear();
      this.focus = undefined;
      this.update();
      this.listen();
    });
  }

  private getGroupType(node: Node<Statistics>, path: StatisticsPath) {
    return (
      this.groupTypes.get(pathId(path)) ??
      node.defaultGroupType ??
      getSelectableGroupTypes(node)[0]
    );
  }

  private buildLines(
    node: Node<Statistics>,
    path: StatisticsPath,
    depth: number,
  ): Line<Statistics>[] {
    if (getSelectableGroupTypes(node).length === 0) return [];

    const groupType = this.getGroupType(node, path);
    const entries = getSortedChildren(node, groupType, this.sortChildren);
    const lines: Line<Statistics>[] = [
      {
        depth,
        nodePath: path,
        text: headingColor(`${camelCaseToWords(groupType)} statistics`),
        headingOf: path,
      },
    ];
    const shownCount =
      this.shownChildren.get(pathId(path)) ?? numberOfInitiallyShownChildren;
    for (const [key, child] of entries.slice(0, shownCount)) {
      const childPath: StatisticsPath = [...path, [groupType, key]];
      lines.push({
        depth: depth + 1,
        nodePath: childPath,
        text: getDisplayName(child, key),
        path: childPath,
        statistics: child.statistics,
      });
      if (this.expanded.has(pathId(childPath))) {
        lines.push(
          ...this.formatStatisticsDetails(child.statistics).map(
            (text, detailIndex) => ({
              depth: depth + 2,
              nodePath: childPath,
              text,
              detailOf: childPath,
              detailIndex,
            }),
          ),
          ...this.buildLines(child, childPath, depth + 2),
        );
      }
    }
    if (entries.length > shownCount) {
      lines.push({
        depth: depth + 1,
        nodePath: path,
        text: ellipsis,
        hiddenChildrenOf: path,
      });
    }
    return lines;
  }

  private get focusables(): Focus[] {
    return this.lines.flatMap((line) => getLineFocus(line) ?? []);
  }

  private rebuildLines() {
    if (!this.root) return;
    this.lines = [
      {
        depth: 0,
        nodePath: [],
        text: this.formatStatistics(this.root.statistics, true),
      },
      ...this.buildLines(this.root, [], 0),
    ];
  }

  private update() {
    if (!this.root) return;
    this.rebuildLines();
    const focusables = this.focusables;
    if (
      !this.focus ||
      !focusables.some((focus) => focusId(focus) === focusId(this.focus!))
    ) {
      this.focus =
        focusables.find((focus) => !focus.isHeading) ?? focusables[0];
    }
    this.render();
  }

  private render() {
    console.clear();
    console.log(helpColor('↑/↓: move the focus'));
    console.log(
      helpColor(
        '→: expand the focused entry and jump into it (on a statistics line: next group type)',
      ),
    );
    console.log(
      helpColor(
        '←: jump to the parent entry and collapse its expansion (on a statistics line: previous group type)',
      ),
    );
    if (this.showSelectionIndicators) {
      console.log(
        helpColor(
          'space: toggle the focused group or taskDescription selection',
        ),
      );
    }
    console.log(helpColor('enter: quit or accept current selection'));
    console.log();

    for (const line of this.lines) {
      const lineFocus = getLineFocus(line);
      const isFocused =
        !!lineFocus &&
        !!this.focus &&
        focusId(lineFocus) === focusId(this.focus);
      const pointer = isFocused ? focusPointerColor('> ') : '  ';
      const selectionIndicator =
        this.getTaskDescriptionSelectionIndicator(line);
      const text = line.statistics
        ? `${this.getStatisticsColor(line.statistics)(`${line.text}:`)} ${this.formatStatistics(line.statistics, isFocused)}`
        : line.text;
      const isInactive =
        this.focus !== undefined && !isHighlighted(line, this.focus);
      console.log(
        indentation(line.depth) +
          selectionIndicator +
          pointer +
          (isInactive ? inactiveColor(text) : text),
      );
    }
  }

  private getTaskDescriptionSelectionIndicator(line: Line<Statistics>): string {
    if (!this.showSelectionIndicators || !line.path || !line.statistics) {
      return '';
    }
    const [groupType, id] = line.path[line.path.length - 1];
    if (groupType !== 'taskDescription') return '';
    const isSelected = this.taskDescriptionSelection()[id] === true;
    return selectionStateIndicators[
      isSelected ? 'explicitSelectionUnselections' : 'implicitNoSelection'
    ].text;
  }

  private focusIndex() {
    const id = this.focus && focusId(this.focus);
    return this.focusables.findIndex((focus) => focusId(focus) === id);
  }

  private showMoreChildrenBelowFocus(): boolean {
    if (!this.focus) return false;
    const id = focusId(this.focus);
    const start = this.lines.findIndex((line) => {
      const lineFocus = getLineFocus(line);
      return !!lineFocus && focusId(lineFocus) === id;
    });
    for (const line of this.lines.slice(start + 1)) {
      if (getLineFocus(line)) return false;
      if (line.hiddenChildrenOf) {
        const hiddenId = pathId(line.hiddenChildrenOf);
        this.shownChildren.set(
          hiddenId,
          (this.shownChildren.get(hiddenId) ?? numberOfInitiallyShownChildren) +
            numberOfInitiallyShownChildren,
        );
        this.rebuildLines();
        return true;
      }
    }
    return false;
  }

  private moveFocus(delta: number) {
    if (delta > 0) this.showMoreChildrenBelowFocus();
    const focusables = this.focusables;
    if (!this.focus || focusables.length === 0) return;
    const next = Math.min(
      focusables.length - 1,
      Math.max(0, this.focusIndex() + delta),
    );
    this.focus = focusables[next];
    this.render();
  }

  private changeGroupType(delta: number) {
    if (!this.root || !this.focus) return;
    const node = getNode(this.root, this.focus.path);
    if (!node) return;
    const groupTypes = getSelectableGroupTypes(node);
    this.groupTypes.set(
      pathId(this.focus.path),
      getNextGroupType(
        groupTypes,
        this.getGroupType(node, this.focus.path),
        delta,
      ),
    );
    this.update();
  }

  private expandFocus() {
    if (!this.root || !this.focus) return;
    if (this.focus.isHeading) {
      this.changeGroupType(1);
      return;
    }
    if (this.focus.detailIndex !== undefined) return;
    const node = getNode(this.root, this.focus.path);
    if (!node) return;
    const groupType =
      getSelectableGroupTypes(node).length > 0
        ? this.getGroupType(node, this.focus.path)
        : undefined;
    const firstChild =
      groupType === undefined
        ? undefined
        : getSortedChildren(node, groupType, this.sortChildren)[0];
    const hasDetails = this.formatStatisticsDetails(node.statistics).length > 0;
    if (!firstChild && !hasDetails) return;
    this.expanded.add(pathId(this.focus.path));
    if (hasDetails) {
      this.focus = { path: this.focus.path, isHeading: false, detailIndex: 0 };
    } else if (groupType !== undefined && firstChild) {
      this.focus = {
        path: [...this.focus.path, [groupType, firstChild[0]]],
        isHeading: false,
      };
    }
    this.update();
  }

  private collapseToParent() {
    if (!this.focus) return;
    if (this.focus.isHeading) {
      this.changeGroupType(-1);
      return;
    }
    if (this.focus.detailIndex !== undefined) {
      this.focus = { path: this.focus.path, isHeading: false };
      this.expanded.delete(pathId(this.focus.path));
      this.update();
      return;
    }
    if (this.focus.path.length < 2) return;
    this.focus = { path: this.focus.path.slice(0, -1), isHeading: false };
    this.expanded.delete(pathId(this.focus.path));
    this.update();
  }

  private toggleFocusedSelection() {
    if (
      !this.focus ||
      this.focus.isHeading ||
      this.focus.detailIndex !== undefined
    )
      return;
    this.toggleSelection(
      getTaskDescriptionOrGroupSelectionPath(this.focus.path),
    );
    this.update();
  }

  private listen() {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.off('keypress', this.keypressHandler);
    process.stdin.on('keypress', this.keypressHandler);
    process.stdin.resume();
  }

  private stopListening() {
    process.stdin.off('keypress', this.keypressHandler);
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    process.stdin.pause();
  }

  private keypressHandler = (str: string | undefined, key?: readline.Key) =>
    this.onKeypress(str, key);

  private onKeypress(str: string | undefined, key?: readline.Key) {
    if (key?.ctrl && key.name === 'c') {
      this.stopListening();
      process.exit(0);
    }
    if (key?.name === 'return') {
      this.stopListening();
      this.resolveDisplay?.();
      this.resolveDisplay = undefined;
      return;
    }
    switch (key?.name) {
      case 'up':
        this.moveFocus(-1);
        break;
      case 'down':
        this.moveFocus(1);
        break;
      case 'right':
        this.expandFocus();
        break;
      case 'left':
        this.collapseToParent();
        break;
      case 'space':
        this.toggleFocusedSelection();
        break;
    }
  }
}

export const consoleDisplayStatistics = async <Statistics extends object>(
  statistics: Node<Statistics>,
  formatStatistics: StatisticsFormatter<Statistics>,
  formatStatisticsDetails: StatisticsDetailsFormatter<Statistics>,
  getStatisticsColor: StatisticsColorer<Statistics>,
  sortChildren: StatisticsSorter<Statistics>,
  toggleSelection: (path: OverviewSelectionPath) => void = () => {},
  taskDescriptionSelection?: TaskDescriptionSelection,
): Promise<void> => {
  const overview = new ConsoleDisplayStatistics(
    formatStatistics,
    formatStatisticsDetails,
    getStatisticsColor,
    sortChildren,
    toggleSelection,
    taskDescriptionSelection,
  );
  await overview.display(statistics);
};
