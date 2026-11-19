import { LearnScheduler } from './learnScheduler/learnScheduler';
import { Result, SaveDataBase, TaskDescription } from './model';
import { Overview } from './overview/overview';
import { TaskPresenter } from './userInterface/taskPresenter';

export class Starter<TD extends TaskDescription> {
  private scheduler;
  private presenter;

  constructor(
    presenter: TaskPresenter<TD>,
    taskDescriptions: TD[],
    private saveDataBase: SaveDataBase,
    private overview: Overview<TD>,
  ) {
    this.scheduler = new LearnScheduler(taskDescriptions);
    this.presenter = presenter;
    this.presenter.onAnswered = this.onAnswered.bind(this);
    this.presenter.onFinished = this.onFinished.bind(this);
    this.restoreFromSaveData();
  }

  private finishSession?: () => void;

  private async runSession() {
    const numberOfTaskDescriptions =
      await this.overview.askForNumberOfTaskDescriptions();
    const suggestedSession = this.scheduler.nextSession(
      numberOfTaskDescriptions,
    );
    const session = await this.overview.displayStatistics(
      this.scheduler.idTaskDescriptionMapping,
      this.scheduler.results,
      suggestedSession,
    );

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

  protected get idTaskDescriptionMapping() {
    return this.scheduler.idTaskDescriptionMapping;
  }
}
