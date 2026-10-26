import chalk from 'chalk';
import readline from 'node:readline';
import { OverviewRecursiveStatistics } from '../../overview/overview.model';
import { Line } from './console.displayStatistics.model';
import {
  formatStatistics,
  getChildren,
  getDisplayName,
  indentation,
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
  ): Line[] {
    const depth = path.length;
    const lines: Line[] = [{ depth, text: formatStatistics(node.statistics) }];
    const children = getChildren(node);
    if (!children) return lines;

    lines.push({ depth, text: chalk.bold(`${children.childType} statistics`) });
    for (const [key, child] of children.entries) {
      const childPath = [...path, key];
      lines.push({ depth, text: getDisplayName(child, key), path: childPath });
      if (this.expanded.has(pathId(childPath))) {
        lines.push(...this.buildLines(child, childPath));
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
    this.lines = this.buildLines(this.root, []);
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
    console.log(chalk.gray('↑/↓: move the focus'));
    console.log(chalk.gray('→: expand / collapse the focused entry'));
    console.log(chalk.gray('q or Ctrl+C: quit'));
    console.log();

    const focusId = this.focus && pathId(this.focus);
    for (const line of this.lines) {
      // Every line reserves the space of the pointer to keep a layer aligned.
      const pointer =
        line.path && pathId(line.path) === focusId ? chalk.yellow('> ') : '  ';
      console.log(indentation(line.depth) + pointer + line.text);
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
