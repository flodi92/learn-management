import chalk from 'chalk';
import { LearningState } from '../../model';
import { SelectionState } from '../../overview/overview.model';

export const learningStateColors: Record<
  LearningState,
  (text: string) => string
> = {
  notLearned: chalk.red,
  learning: chalk.magenta,
  learned: chalk.green,
  forRepeat: chalk.cyan,
};

export const headingColor = chalk.bold;
export const focusPointerColor = chalk.yellow;
export const helpColor = chalk.gray;

export const selectionStateIndicators: Record<
  SelectionState,
  { text: string; isHighlighted: boolean }
> = {
  implicitNoSelection: { text: '   ', isHighlighted: false },
  implicitSelection: { text: '[*]', isHighlighted: false },
  implicitFullSelection: { text: '[*]', isHighlighted: true },
  explicitSelectionUnselections: { text: '[+]', isHighlighted: false },
  explicitSelection: { text: '[+]', isHighlighted: true },
  explicitUnselection: { text: '[-]', isHighlighted: true },
};

export const selectionHighlightColor = chalk.bgHex('#4a4827');
export const selectedColor = chalk.italic;
export const unfocusedSelectionColor = chalk.gray;

// Number of children shown for each element, further children are loaded in steps of this size.
export const numberOfInitiallyShownChildren = 15;
export const ellipsis = '…';

// Opacity of all layers that do not contain the focused line.
export const inactiveOpacity = 0.8;

// A terminal cannot render partial opacity, so the faint style is used instead.
export const inactiveColor = (text: string): string =>
  inactiveOpacity < 1 ? chalk.dim(text) : text;
