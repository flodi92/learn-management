import { TaskPresenter } from './exampleData/regExp/regExpTaskPresenter/regExpTaskPresenter';
import {
  LearnScheduler,
  Result,
  SaveData,
} from './LearnScheduler/LearnScheduler';

export interface Task {
  id: string;
  parentIds?: string[];
}

export class Main<T extends Task> {
  private scheduler;
  private presenter;

  constructor(presenter: TaskPresenter<T>, tasks: T[]) {
    this.scheduler = new LearnScheduler(tasks);
    this.presenter = presenter;
    this.presenter.onAnswered = this.onAnswered;
    this.presenter.onFinished = this.onFinished;
    // @todo saving
  }

  start() {
    const session = this.scheduler.nextSession(3);

    this.presenter.start(session);
  }

  onAnswered({ id, correctness }: Result) {
    this.scheduler.recordResults({ [id]: correctness });
  }

  onFinished() {
    /* @todo ask for next session */
  }

  getSaveData(): SaveData {
    return this.scheduler.getSaveData();
  }

  restoreFromSaveData(saveData: SaveData) {
    this.scheduler.restoreFromSaveData(saveData);
  }
}
