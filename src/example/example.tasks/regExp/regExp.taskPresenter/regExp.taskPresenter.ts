import chalk from 'chalk';
import readline from 'node:readline';
import { RegExpTaskDescription } from '../regExp.model';
import { Result } from '../../../../model';
import { TaskPresenter } from '../../../../userInterface/taskPresenter';
import { maximumNumberOfShownExamples } from '../regExp.constants';
import {
  getExampleAlternative,
  getExampleValue,
} from '../regExp.utils/regExp.utils';
import { isNotUndefined } from '../../../../utils';

type Example = {
  text: string;
  alternative?: string;
  isPositive: boolean;
  answer?: 'positive' | 'negative';
};

const shuffle = <T>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildExamples = (taskDescription: RegExpTaskDescription): Example[] => {
  const positives = shuffle(
    (taskDescription.positiveExamples ?? []).map((example) => ({
      text: getExampleValue(example),
      alternative: getExampleAlternative(example),
      isPositive: true,
    })),
  );
  const negatives = shuffle(
    (taskDescription.negativeExamples ?? []).map((example) => ({
      text: getExampleValue(example),
      alternative: getExampleAlternative(example),
      isPositive: false,
    })),
  );

  // Reserve one of each kind (if available), then fill the rest randomly.
  const selected = [positives.shift(), negatives.shift()].filter(
    isNotUndefined,
  );
  const rest = shuffle([...positives, ...negatives]);
  selected.push(
    ...rest.slice(
      0,
      Math.max(0, maximumNumberOfShownExamples - selected.length),
    ),
  );
  return shuffle(selected);
};

const isAnsweredCorrectly = (example: Example): boolean =>
  (example.answer === 'positive') === example.isPositive;

export class RegExpTaskPresenter extends TaskPresenter<RegExpTaskDescription> {
  private taskDescriptions: RegExpTaskDescription[] = [];
  private currentTaskDescriptionIndex = 0;
  private examples: Example[] = [];
  private cursor = 0;
  private checked = false;
  private summary = { correct: 0, incorrect: 0 };

  private _onAnswered?: (result: Result) => void;
  private _onFinished?: () => void;

  set onAnswered(handler: (result: Result) => void) {
    this._onAnswered = handler;
  }

  set onFinished(handler: () => void) {
    this._onFinished = handler;
  }

  start(taskDescriptions: RegExpTaskDescription[]) {
    this.taskDescriptions = taskDescriptions;
    this.currentTaskDescriptionIndex = 0;
    this.summary = { correct: 0, incorrect: 0 };

    if (this.taskDescriptions.length === 0) {
      console.log('No taskDescriptions available.');
      return;
    }
    this.loadTaskDescription();
    this.render();
    this.listen();
  }

  private get currentTaskDescription(): RegExpTaskDescription {
    return this.taskDescriptions[this.currentTaskDescriptionIndex];
  }

  private loadTaskDescription() {
    this.examples = buildExamples(this.currentTaskDescription);
    this.cursor = 0;
    this.checked = false;
  }

  private render() {
    console.clear();
    console.log(
      chalk.bold(
        `TaskDescription ${this.currentTaskDescriptionIndex + 1}/${this.taskDescriptions.length}: `,
      ) + chalk.cyan(this.currentTaskDescription.expression.toString()),
    );
    console.log(
      chalk.dim(
        'Use ↑/↓ to move, ←/→ to set positive/negative, then Enter to check.',
      ),
    );
    console.log();

    this.examples.forEach((example, idx) => {
      const pointer =
        !this.checked && idx === this.cursor ? chalk.yellow('> ') : '  ';
      const label = example.answer ? ` (${example.answer})` : '';
      const shown =
        example.alternative !== undefined
          ? chalk.magenta(`<${example.alternative}>`)
          : example.text;
      const line = `${pointer}${shown}${label}`;

      console.log(
        this.checked
          ? isAnsweredCorrectly(example)
            ? chalk.green(line)
            : chalk.red(line)
          : line,
      );
    });

    console.log();
    if (this.checked) {
      const allCorrect = this.examples.every(isAnsweredCorrectly);
      console.log(
        allCorrect
          ? chalk.green('All correct.')
          : chalk.red('Some answers were wrong.'),
      );
      console.log(chalk.dim('Press Enter to continue.'));
    }
  }

  private listen() {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.on('keypress', this.keypressHandler);
    process.stdin.resume();
  }

  private keypressHandler = (str: string, key: readline.Key) =>
    this.onKeypress(str, key);

  private stopListening() {
    process.stdin.off('keypress', this.keypressHandler);
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    process.stdin.pause();
  }

  private onKeypress(str: string, key: readline.Key) {
    if (key.ctrl && key.name === 'c') {
      this.exit();
      return;
    }

    if (!this.checked && (str === 'p' || str === 'n')) {
      this.examples[this.cursor].answer = str === 'p' ? 'positive' : 'negative';
      this.cursor = (this.cursor + 1) % this.examples.length;
      this.render();
      return;
    }

    if (!this.checked && (key.name === 'up' || key.name === 'down')) {
      const delta = key.name === 'up' ? -1 : 1;
      this.cursor =
        (this.cursor + delta + this.examples.length) % this.examples.length;
      this.render();
      return;
    }

    if (!this.checked && (key.name === 'left' || key.name === 'right')) {
      const current = this.examples[this.cursor].answer;
      const first = key.name === 'left' ? 'positive' : 'negative';
      const second = key.name === 'left' ? 'negative' : 'positive';
      this.examples[this.cursor].answer =
        current === undefined ? first : current === first ? second : first;
      this.render();
      return;
    }

    if (key.name === 'return') {
      if (!this.checked) {
        const allExamplesClassified = this.examples.every(
          (example) => example.answer !== undefined,
        );
        if (!allExamplesClassified) {
          console.log(
            'Please first classify all examples as positive or negative',
          );
          return;
        }
        this.checked = true;
        this.render();
        this.updateSummary();
      } else {
        this.nextTaskDescription();
        return;
      }
    }
  }

  private updateSummary() {
    const isCorrect = this.examples.every(isAnsweredCorrectly);
    if (isCorrect) {
      this.summary.correct += 1;
    } else {
      this.summary.incorrect += 1;
    }
    this._onAnswered?.({
      id: this.currentTaskDescription.id,
      correctness: isCorrect ? 1 : 0,
    });
  }

  private nextTaskDescription() {
    this.currentTaskDescriptionIndex += 1;
    if (this.currentTaskDescriptionIndex >= this.taskDescriptions.length) {
      this.finish();
      return;
    }
    this.loadTaskDescription();
    this.render();
  }

  private finish() {
    console.clear();
    console.log(chalk.bold('Summary'));
    console.log(chalk.green(`Correct: ${this.summary.correct}`));
    console.log(chalk.red(`Incorrect: ${this.summary.incorrect}`));
    this.stopListening();
    this._onFinished?.();
  }

  private exit() {
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    process.stdin.pause();
    process.exit(0);
  }
}
