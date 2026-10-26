import { LearnScheduler } from './learnScheduler/learnScheduler';
import { Result, SaveDataBase, LearnSubject } from './model';
import { Overview } from './overview/overview';
import { TaskPresenter } from './userInterface/taskPresenter';

export class Starter<Task extends LearnSubject> {
  private scheduler;
  private presenter;

  constructor(
    presenter: TaskPresenter<Task>,
    tasks: Task[],
    private saveDataBase: SaveDataBase,
    private overview: Overview,
  ) {
    this.scheduler = new LearnScheduler(tasks);
    this.presenter = presenter;
    this.presenter.onAnswered = this.onAnswered.bind(this);
    this.presenter.onFinished = this.onFinished.bind(this);
    this.restoreFromSaveData();
  }

  private finishSession?: () => void;

  private async runSession() {
    await this.overview.displayStatistics(
      this.scheduler.idSubjectMapping,
      this.scheduler.results,
    );
    const numberOfTasks = await this.overview.askForNumberOfTasks();
    const session = this.scheduler.nextSession(numberOfTasks);

    const finished = new Promise<void>((resolve) => {
      this.finishSession = resolve;
    });
    this.presenter.start(session);
    await finished;
  }

  private onAnswered({ id, correctness }: Result) {
    this.scheduler.recordResults({ [id]: correctness });
    this.saveData();
  }

  private onFinished() {
    this.finishSession?.();
  }

  public async start() {
    while (true) {
      await this.runSession();
      await this.overview.showSessionFinishedView();
    }
  }

  private saveData() {
    this.saveDataBase.saveData(this.scheduler.getSaveData());
  }

  private restoreFromSaveData() {
    this.scheduler.restoreFromSaveData(this.saveDataBase.loadSaveData());
  }
}
