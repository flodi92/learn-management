import chalk from 'chalk';
import readline from 'node:readline';
import { TaskPresenter } from '../../../../userInterface/taskPresenter';
import { RegExpTaskDescription } from '../regExp.tasks/regExp.model';
import { Confusion, Example } from './regExp.taskPresenter.model';
import {
  buildExamples,
  determineConfusions,
  getConfusionMessage,
  getExampleAlternative,
  isAnsweredCorrectly,
} from './regExp.taskPresenter.utils';

export class RegExpTaskPresenter extends TaskPresenter<RegExpTaskDescription> {
  private examples: Example[] = [];
  private confusions: Confusion[] = [];
  private cursor = 0;
  private checked = false;

  constructor(allTaskDescriptions: RegExpTaskDescription[]) {
    super(allTaskDescriptions);
  }

  start(taskDescriptions: RegExpTaskDescription[]) {
    super.start(taskDescriptions);
    if (taskDescriptions.length === 0) {
      return;
    }
    this.listen();
  }

  protected loadTaskDescription() {
    this.examples = buildExamples(this.currentTaskDescription);
    this.confusions = [];
    this.cursor = 0;
    this.checked = false;
  }

  protected render() {
    console.clear();
    console.log(
      chalk.bold(
        `${this.isRepeating ? 'TaskDescription repeating' : 'TaskDescription'} ${this.currentTaskDescriptionIndex + 1}/${this.presentedTaskDescriptions.length}: `,
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
      const line = `${pointer}${example.alternative}${label}`;

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
      this.confusions.forEach((confusion) =>
        console.log(
          chalk.yellow(
            getConfusionMessage(this.currentTaskDescription, confusion),
          ),
        ),
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
        this.confusions = determineConfusions({
          taskDescription: this.currentTaskDescription,
          examples: this.examples,
          allTaskDescriptions: this.allTaskDescriptions,
        });
        this.render();
        this.updateSummary();
      } else {
        this.nextTaskDescription();
        return;
      }
    }
  }

  protected isCurrentTaskDescriptionAnsweredCorrectly() {
    return this.examples.every(isAnsweredCorrectly);
  }

  protected currentTaskDescriptionWasConfusedWith() {
    return this.confusions.map(
      ({ linkedTaskDescription }) => linkedTaskDescription.id,
    );
  }

  protected finish() {
    console.clear();
    console.log(chalk.bold('Summary'));
    console.log(chalk.green(`Correct: ${this.summary.correct}`));
    console.log(chalk.red(`Incorrect: ${this.summary.incorrect}`));
    this.stopListening();
    this.onFinished?.();
  }

  private exit() {
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    process.stdin.pause();
    process.exit(0);
  }
}
