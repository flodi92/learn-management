import { regExpTasks } from './exampleData/regExp';
import { RegExpTaskPresenter } from './exampleData/regExp/regExpTaskPresenter/regExpTaskPresenter';
import { LearnScheduler } from './LearnScheduler/LearnScheduler';

export class Main {
  private scheduler;
  private presenter;

  constructor() {
    this.scheduler = new LearnScheduler(regExpTasks);
    this.presenter = new RegExpTaskPresenter({
      onAnswered: this.onAnswered,
      onFinished: this.onFinished,
    });
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
}
