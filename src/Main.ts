import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import type { TaskPresenter } from './exampleData/regExp/regExpTaskPresenter/regExpTaskPresenter';
import { LearnScheduler } from './LearnScheduler/LearnScheduler';
import { Result, SaveDataBase, Task } from './model';

export class Main<T extends Task> {
  private scheduler;
  private presenter;

  constructor(
    presenter: TaskPresenter<T>,
    tasks: T[],
    private saveDataBase: SaveDataBase,
  ) {
    this.scheduler = new LearnScheduler(tasks);
    this.presenter = presenter;
    this.presenter.onAnswered = this.onAnswered.bind(this);
    this.presenter.onFinished = this.onFinished.bind(this);
    this.restoreFromSaveData();
  }

  async start() {
    const readline = createInterface({ input: stdin, output: stdout });
    let numberOfTasks: number | undefined;
    try {
      while (numberOfTasks === undefined) {
        const answer = await readline.question(
          'How many questions do you want to examine today? ',
        );
        const parsedAnswer = Number(answer);

        if (Number.isInteger(parsedAnswer) && parsedAnswer > 0) {
          numberOfTasks = parsedAnswer;
        } else {
          console.log('Please enter a positive whole number.');
        }
      }
    } catch {
      return;
    } finally {
      readline.close();
    }
    const session = this.scheduler.nextSession(numberOfTasks);

    this.presenter.start(session);
  }

  private onAnswered({ id, correctness }: Result) {
    this.scheduler.recordResults({ [id]: correctness });
    this.saveData();
  }

  private async onFinished() {
    const readline = createInterface({ input: stdin, output: stdout });

    try {
      await readline.question(
        'Session finished. Press Enter to start a new session.\n',
      );
    } catch {
      return;
    } finally {
      readline.close();
    }

    this.start();
  }

  private saveData() {
    this.saveDataBase.saveData(this.scheduler.getSaveData());
  }

  private restoreFromSaveData() {
    this.scheduler.restoreFromSaveData(this.saveDataBase.loadSaveData());
  }
}
