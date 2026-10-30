import readline from 'node:readline';
import { OverviewRecursiveUndeterminedStatistics } from '../../../overview/overview.model';
import {
  ellipsis,
  focusPointerColor,
  headingColor,
  helpColor,
  inactiveColor,
  numberOfInitiallyShownChildren,
} from '../console.constants';
import {
  Line,
  StatisticsColorer,
  StatisticsFormatter,
  StatisticsSorter,
} from './console.displayStatistics.model';
import {
  getChildren,
  getDisplayName,
  getNode,
  indentation,
  isHighlighted,
  pathId,
} from './console.displayStatistics.utils';

export class ConsoleDisplayStatistics<Statistics extends object> {
  private root?: OverviewRecursiveUndeterminedStatistics<Statistics>;
  private expanded = new Set<string>();
  private shownChildren = new Map<string, number>();
  private lines: Line<Statistics>[] = [];
  private focus?: string[];
  private resolveDisplay?: () => void;

  constructor(
    private readonly formatStatistics: StatisticsFormatter<Statistics>,
    private readonly getStatisticsColor: StatisticsColorer<Statistics>,
    private readonly sortChildren: StatisticsSorter<Statistics>,
  ) {}

  public display(
    statistics: OverviewRecursiveUndeterminedStatistics<Statistics>,
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      this.resolveDisplay = resolve;
      this.root = statistics;
      this.expanded.clear();
      this.shownChildren.clear();
      this.focus = undefined;
      this.update();
      this.listen();
    });
  }

  private buildLines(
    node: OverviewRecursiveUndeterminedStatistics<Statistics>,
    path: string[],
    depth: number,
  ): Line<Statistics>[] {
    const children = getChildren(node, this.sortChildren);
    if (!children) return [];

    const lines: Line<Statistics>[] = [
      {
        depth,
        nodePath: path,
        text: headingColor(`${children.childType} statistics`),
      },
    ];
    const shownCount =
      this.shownChildren.get(pathId(path)) ?? numberOfInitiallyShownChildren;
    for (const [key, child] of children.entries.slice(0, shownCount)) {
      const childPath = [...path, key];
      lines.push({
        depth: depth + 1,
        nodePath: childPath,
        text: getDisplayName(child, key),
        path: childPath,
        statistics: child.statistics,
      });
      if (this.expanded.has(pathId(childPath))) {
        lines.push(...this.buildLines(child, childPath, depth + 2));
      }
    }
    if (children.entries.length > shownCount) {
      lines.push({
        depth: depth + 1,
        nodePath: path,
        text: ellipsis,
        hiddenChildrenOf: path,
      });
    }
    return lines;
  }

  private get focusablePaths(): string[][] {
    return this.lines.flatMap((line) => (line.path ? [line.path] : []));
  }

  private rebuildLines() {
    if (!this.root) return;
    this.lines = [
      {
        depth: 0,
        nodePath: [],
        text: this.formatStatistics(this.root.statistics, false),
      },
      ...this.buildLines(this.root, [], 0),
    ];
  }

  private update() {
    if (!this.root) return;
    this.rebuildLines();
    const focusable = this.focusablePaths;
    if (
      !this.focus ||
      !focusable.some((path) => pathId(path) === pathId(this.focus!))
    ) {
      this.focus = focusable[0];
    }
    this.render();
  }

  private render() {
    console.clear();
    console.log(helpColor('↑/↓: move the focus'));
    console.log(helpColor('→: expand the focused entry and jump into it'));
    console.log(
      helpColor('←: jump to the parent entry and collapse its expansion'),
    );
    console.log(helpColor('q or Ctrl+C: quit'));
    console.log();

    const focusId = this.focus && pathId(this.focus);
    for (const line of this.lines) {
      const isFocused = !!line.path && pathId(line.path) === focusId;
      const pointer = isFocused ? focusPointerColor('> ') : '  ';
      const text = line.statistics
        ? `${this.getStatisticsColor(line.statistics)(`${line.text}:`)} ${this.formatStatistics(line.statistics, isFocused)}`
        : line.text;
      const isInactive =
        this.focus !== undefined && !isHighlighted(line, this.focus);
      console.log(
        indentation(line.depth) +
          pointer +
          (isInactive ? inactiveColor(text) : text),
      );
    }
  }

  private showMoreChildrenBelowFocus(): boolean {
    if (!this.focus) return false;
    const focusId = pathId(this.focus);
    const start = this.lines.findIndex(
      (line) => line.path && pathId(line.path) === focusId,
    );
    for (const line of this.lines.slice(start + 1)) {
      if (line.path) return false;
      if (line.hiddenChildrenOf) {
        const id = pathId(line.hiddenChildrenOf);
        this.shownChildren.set(
          id,
          (this.shownChildren.get(id) ?? numberOfInitiallyShownChildren) +
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
    const focusable = this.focusablePaths;
    if (!this.focus || focusable.length === 0) return;
    const focusId = pathId(this.focus);
    const index = focusable.findIndex((path) => pathId(path) === focusId);
    const next = Math.min(focusable.length - 1, Math.max(0, index + delta));
    this.focus = focusable[next];
    this.render();
  }

  private expandFocus() {
    if (!this.root || !this.focus) return;
    const node = getNode(this.root, this.focus);
    const firstChild = node && getChildren(node, this.sortChildren)?.entries[0];
    if (!firstChild) return;
    this.expanded.add(pathId(this.focus));
    this.focus = [...this.focus, firstChild[0]];
    this.update();
  }

  private collapseToParent() {
    if (!this.focus || this.focus.length < 2) return;
    this.focus = this.focus.slice(0, -1);
    this.expanded.delete(pathId(this.focus));
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
    if ((key?.ctrl && key.name === 'c') || str === 'q') {
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
    }
  }
}

export const consoleDisplayStatistics = async <Statistics extends object>(
  statistics: OverviewRecursiveUndeterminedStatistics<Statistics>,
  formatStatistics: StatisticsFormatter<Statistics>,
  getStatisticsColor: StatisticsColorer<Statistics>,
  sortChildren: StatisticsSorter<Statistics>,
): Promise<void> => {
  const overview = new ConsoleDisplayStatistics(
    formatStatistics,
    getStatisticsColor,
    sortChildren,
  );
  await overview.display(statistics);
};
