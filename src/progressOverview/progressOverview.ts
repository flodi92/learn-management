import chalk from 'chalk';
import readline from 'node:readline';
import { LearningState } from '../model';

interface ProgressItem {
  label: string;
  mastery: number;
  lastRepetitionBeforeDays: number; // 1 to 365
  numberOfRepetitions: number; // 1 to 5
  learningState: LearningState;
}

type ProgressAggregation = {
  avgLastRepetitionBeforeDays: number; // 1 to 365
} & Record<LearningState, number>;

type Statistics<
  ChildType extends string | undefined = undefined,
  ChildKey extends string | number = string,
  ChildStatistics extends Statistics<any, any, any> = Statistics<any, any, any>,
> = {
  statistics: ChildType extends undefined ? ProgressItem : ProgressAggregation;
} & (ChildType extends undefined
  ? {}
  : {
      childType: ChildType;
      children: Record<ChildKey, ChildStatistics>;
    });

export type StatisticsHierarchy = Statistics<
  'category',
  string,
  Statistics<'relevance', number, Statistics>
>;

type AnyStatistics = Statistics<any, any, any>;

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
  node: AnyStatistics,
): { childType: string; entries: [string, AnyStatistics][] } | undefined =>
  'children' in node
    ? { childType: node.childType, entries: Object.entries(node.children) }
    : undefined;

export class ProgressOverview {
  private root?: AnyStatistics;
  private expanded = new Set<string>();
  private lines: Line[] = [];
  private focus?: Path;

  display(statistics: Statistics<any, any, any>) {
    this.root = statistics;
    this.expanded.clear();
    this.focus = undefined;
    this.update();
    this.listen();
  }

  private buildLines(node: AnyStatistics, path: Path): Line[] {
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
