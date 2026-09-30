import { regExpTasks } from './exampleData/regExp';
import {
  RegExpTaskPresenter,
  TaskPresenter,
} from './exampleData/regExp/regExpTaskPresenter/regExpTaskPresenter';
import { LearnScheduler, SaveData } from './LearnScheduler/LearnScheduler';

export class Main<T extends { id: string; parentIds?: string[] }> {
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

  onAnswered({ id, isCorrect }: { id: string; isCorrect: boolean }) {
    this.scheduler.recordResults({ [id]: isCorrect ? 1 : 0 });
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
