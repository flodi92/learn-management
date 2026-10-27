import chalk from 'chalk';
import { LearningState } from '../../model';

export const learningStateColors: Record<
  LearningState,
  (text: string) => string
> = {
  notLearned: chalk.red,
  learning: chalk.magenta,
  learned: chalk.green,
  forRepeat: chalk.cyan,
};

export const statisticsLabelColor = chalk.dim;
export const headingColor = chalk.bold;
export const focusPointerColor = chalk.yellow;
export const helpColor = chalk.gray;
