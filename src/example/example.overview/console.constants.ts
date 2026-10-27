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

// Number of children shown for each element, further children are loaded in steps of this size.
export const numberOfInitiallyShownChildren = 15;
export const ellipsis = '…';

// Opacity of all layers that do not contain the focused line.
export const inactiveOpacity = 0.8;

// A terminal cannot render partial opacity, so the faint style is used instead.
export const inactiveColor = (text: string): string =>
  inactiveOpacity < 1 ? chalk.dim(text) : text;
