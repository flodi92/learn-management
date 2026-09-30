import { TaskPresenter } from './exampleData/regExp/regExpTaskPresenter/regExpTaskPresenter';
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
    this.presenter.onAnswered = this.onAnswered;
    this.presenter.onFinished = this.onFinished;
    this.restoreFromSaveData();
  }

  start() {
    const session = this.scheduler.nextSession(3);

    this.presenter.start(session);
  }

  private onAnswered({ id, correctness }: Result) {
    this.scheduler.recordResults({ [id]: correctness });
    this.saveData();
  }

  private onFinished() {
    /* @todo ask for next session */
  }

  private saveData() {
    this.saveDataBase.saveData(this.scheduler.getSaveData());
  }

  private restoreFromSaveData() {
    this.scheduler.restoreFromSaveData(this.saveDataBase.loadSaveData());
  }
}
