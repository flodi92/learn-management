import chalk from 'chalk';
import readline from 'node:readline';
import { LearningState } from '../model';

export interface ProgressItem {
  label: string;
  mastery: number;
  lastRepetitionBeforeDays: number;
  numberOfRepetitions: number;
  learningState: LearningState;
}

export type ProgressAggregation = {
  avgLastRepetitionBeforeDays: number;
} & Record<LearningState, number>;

export interface GeneralStatistics {
  statistics: ProgressItem | ProgressAggregation;
  childType?: string;
  children?: Record<string | number, GeneralStatistics>;
}

// A path of child keys leading from the root to a (nested) child.
type Path = string[];

type Line = {
  depth: number;
  text: string;
  // Only lines of children can be focused.
  path?: Path;
};

const learningStateColors: Record<LearningState, (text: string) => string> = {
  notLearned: chalk.red,
  learning: chalk.magenta,
  learned: chalk.green,
  forRepeat: chalk.cyan,
};

const isLearningState = (value: unknown): value is LearningState =>
  typeof value === 'string' && value in learningStateColors;

const indentation = (depth: number) => '  '.repeat(depth);

const pathId = (path: Path) => JSON.stringify(path);

const formatStatistics = (statistics: object): string =>
  Object.entries(statistics)
    .map(([key, value]) => {
      const state = isLearningState(key)
        ? key
        : isLearningState(value)
          ? value
          : undefined;
      const text = String(value);
      return `${chalk.dim(`${key}:`)} ${state ? learningStateColors[state](text) : text}`;
    })
    .join(', ');

const getChildren = (
  node: GeneralStatistics,
): { childType: string; entries: [string, GeneralStatistics][] } | undefined =>
  node.children !== undefined && node.childType !== undefined
    ? { childType: node.childType, entries: Object.entries(node.children) }
    : undefined;

export class ProgressOverview {
  private root?: GeneralStatistics;
  private expanded = new Set<string>();
  private lines: Line[] = [];
  private focus?: Path;
  private resolveDisplay?: () => void;

  display(statistics: GeneralStatistics): Promise<void> {
    return new Promise<void>((resolve) => {
      this.resolveDisplay = resolve;
      this.root = statistics;
      this.expanded.clear();
      this.focus = undefined;
      this.update();
      this.listen();
    });
  }

  private buildLines(node: GeneralStatistics, path: Path): Line[] {
    const depth = path.length;
    const lines: Line[] = [{ depth, text: formatStatistics(node.statistics) }];
    const children = getChildren(node);
    if (!children) return lines;

    lines.push({ depth, text: chalk.bold(`${children.childType} statistics`) });
    for (const [key, child] of children.entries) {
      const childPath = [...path, key];
      lines.push({ depth, text: key, path: childPath });
      if (this.expanded.has(pathId(childPath))) {
        lines.push(...this.buildLines(child, childPath));
      }
    }
    return lines;
  }

  private get focusablePaths(): Path[] {
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
