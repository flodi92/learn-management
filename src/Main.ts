import type { TaskPresenter } from './exampleData/regExp/regExpTaskPresenter/regExpTaskPresenter';
import { LearnScheduler } from './LearnScheduler/LearnScheduler';
import { Result, SaveDataBase, Task } from './model';
import { Overview } from './userInterface/Overview';

export class Main<T extends Task> {
  private scheduler;
  private presenter;

  constructor(
    presenter: TaskPresenter<T>,
    tasks: T[],
    private saveDataBase: SaveDataBase,
    private overview: Overview,
  ) {
    this.scheduler = new LearnScheduler(tasks);
    this.presenter = presenter;
    this.presenter.onAnswered = this.onAnswered.bind(this);
    this.presenter.onFinished = this.onFinished.bind(this);
    this.restoreFromSaveData();
  }

  async start() {
    const numberOfTasks = await this.overview.askForNumberOfTasks();
    const session = this.scheduler.nextSession(numberOfTasks);

    this.presenter.start(session);
  }

  private onAnswered({ id, correctness }: Result) {
    this.scheduler.recordResults({ [id]: correctness });
    this.saveData();
  }

  private async onFinished() {
    await this.overview.showSessionFinishedView();

    this.start();
  }

  private saveData() {
    this.saveDataBase.saveData(this.scheduler.getSaveData());
  }

  private restoreFromSaveData() {
    this.scheduler.restoreFromSaveData(this.saveDataBase.loadSaveData());
  }
}
