import readline from 'node:readline';
import { OverviewRecursiveStatistics } from '../../overview/overview.model';
import {
  focusPointerColor,
  headingColor,
  helpColor,
  inactiveColor,
} from './console.constants';
import { Line } from './console.displayStatistics.model';
import {
  formatStatistics,
  getChildren,
  getDisplayName,
  getStatisticsColor,
  indentation,
  isHighlighted,
  pathId,
} from './console.displayStatistics.utils';

export class ConsoleDisplayStatistics {
  private root?: OverviewRecursiveStatistics;
  private expanded = new Set<string>();
  private lines: Line[] = [];
  private focus?: string[];
  private resolveDisplay?: () => void;

  public display(statistics: OverviewRecursiveStatistics): Promise<void> {
    return new Promise<void>((resolve) => {
      this.resolveDisplay = resolve;
      this.root = statistics;
      this.expanded.clear();
      this.focus = undefined;
      this.update();
      this.listen();
    });
  }

  private buildLines(
    node: OverviewRecursiveStatistics,
    path: string[],
    depth: number,
  ): Line[] {
    const children = getChildren(node);
    if (!children) return [];

    const lines: Line[] = [
      {
        depth,
        nodePath: path,
        text: headingColor(`${children.childType} statistics`),
      },
    ];
    for (const [key, child] of children.entries) {
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
    return lines;
  }

  private get focusablePaths(): string[][] {
    return this.lines.flatMap((line) => (line.path ? [line.path] : []));
  }

  // Rebuilds the lines and keeps the focus on a valid child.
  private update() {
    if (!this.root) return;
    this.lines = [
      // Only the root shows its statistics in an own line, children show them in their line.
      {
        depth: 0,
        nodePath: [],
        text: formatStatistics(this.root.statistics, false),
      },
      ...this.buildLines(this.root, [], 0),
    ];
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
    console.log(helpColor('→: expand / collapse the focused entry'));
    console.log(helpColor('q or Ctrl+C: quit'));
    console.log();

    const focusId = this.focus && pathId(this.focus);
    for (const line of this.lines) {
      const isFocused = !!line.path && pathId(line.path) === focusId;
      // Every line reserves the space of the pointer to keep a layer aligned.
      const pointer = isFocused ? focusPointerColor('> ') : '  ';
      const text = line.statistics
        ? `${getStatisticsColor(line.statistics)(line.text)} ${formatStatistics(line.statistics, isFocused)}`
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

  private moveFocus(delta: number) {
    const focusable = this.focusablePaths;
    if (!this.focus || focusable.length === 0) return;
    const focusId = pathId(this.focus);
    const index = focusable.findIndex((path) => pathId(path) === focusId);
    const next = Math.min(focusable.length - 1, Math.max(0, index + delta));
    this.focus = focusable[next];
    this.render();
  }

  private toggleExpansion() {
    if (!this.focus) return;
    const focusId = pathId(this.focus);
    if (!this.expanded.delete(focusId)) this.expanded.add(focusId);
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
        this.toggleExpansion();
        break;
    }
  }
}

export const consoleDisplayStatistics = async (
  statistics: OverviewRecursiveStatistics,
): Promise<void> => {
  const overview = new ConsoleDisplayStatistics();
  await overview.display(statistics);
};
