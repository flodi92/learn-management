import chalk from 'chalk';
import readline from 'node:readline';
import { regExpTasks } from '../index';
import { RegexTask } from '../regex.model';

type Example = {
  text: string;
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

const pickRandomTasks = (allTasks: RegexTask[], count: number): RegexTask[] =>
  shuffle(allTasks).slice(0, count);

const buildExamples = (task: RegexTask): Example[] =>
  shuffle([
    ...(task.positiveExamples ?? []).map((text) => ({
      text,
      isPositive: true,
    })),
    ...(task.negativeExamples ?? []).map((text) => ({
      text,
      isPositive: false,
    })),
  ]);

const isAnsweredCorrectly = (example: Example): boolean =>
  (example.answer === 'positive') === example.isPositive;

class TaskPresenter {
  private tasks: RegexTask[] = [];
  private currentTaskIndex = 0;
  private examples: Example[] = [];
  private cursor = 0;
  private checked = false;
  private summary = { correct: 0, incorrect: 0 };

  private onAnswered: (result: { id: string; isCorrect: boolean }) => void;
  private onFinished: () => void;

  constructor(options: {
    onAnswered: (result: { id: string; isCorrect: boolean }) => void;
    onFinished: () => void;
  }) {
    this.onAnswered = options.onAnswered;
    this.onFinished = options.onFinished;
  }

  start(tasks: RegexTask[]) {
    this.tasks = tasks;

    if (this.tasks.length === 0) {
      console.log('No tasks available.');
      return;
    }
    this.loadTask();
    this.render();
    this.listen();
  }

  private get currentTask(): RegexTask {
    return this.tasks[this.currentTaskIndex];
  }

  private loadTask() {
    this.examples = buildExamples(this.currentTask);
    this.cursor = 0;
    this.checked = false;
  }

  private render() {
    console.clear();
    console.log(
      chalk.bold(`Task ${this.currentTaskIndex + 1}/${this.tasks.length}: `) +
        chalk.cyan(this.currentTask.expression.toString()),
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
      const line = `${pointer}${example.text}${label}`;

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
    process.stdin.on('keypress', (str: string, key: readline.Key) =>
      this.onKeypress(str, key),
    );
    process.stdin.resume();
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
        this.nextTask();
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
    this.onAnswered({ id: this.currentTask.id, isCorrect });
  }

  private nextTask() {
    this.currentTaskIndex += 1;
    if (this.currentTaskIndex >= this.tasks.length) {
      this.finish();
      return;
    }
    this.loadTask();
    this.render();
  }

  private finish() {
    console.clear();
    console.log(chalk.bold('Summary'));
    console.log(chalk.green(`Correct: ${this.summary.correct}`));
    console.log(chalk.red(`Incorrect: ${this.summary.incorrect}`));
    this.onFinished();
    this.exit();
  }

  private exit() {
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    process.stdin.pause();
    process.exit(0);
  }
}

const presenter = new TaskPresenter({
  onAnswered: (result) => console.log('Answered:', result),
  onFinished: () => console.log('Finished all tasks.'),
});
presenter.start(pickRandomTasks(regExpTasks, 10));
