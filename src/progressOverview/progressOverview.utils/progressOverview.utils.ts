import chalk from 'chalk';
import { LearningState } from '../../model';
import { GeneralStatistics } from '../progressOverview.model';

export const learningStateColors: Record<
  LearningState,
  (text: string) => string
> = {
  notLearned: chalk.red,
  learning: chalk.magenta,
  learned: chalk.green,
  forRepeat: chalk.cyan,
};

export const isLearningState = (value: unknown): value is LearningState =>
  typeof value === 'string' && value in learningStateColors;

export const indentation = (depth: number) => '  '.repeat(depth);

export const pathId = (path: string[]) => JSON.stringify(path);

export const formatStatistics = (statistics: object): string =>
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

export const getChildren = (
  node: GeneralStatistics,
): { childType: string; entries: [string, GeneralStatistics][] } | undefined =>
  node.children !== undefined && node.childType !== undefined
    ? { childType: node.childType, entries: Object.entries(node.children) }
    : undefined;
