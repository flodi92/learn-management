import { Result, TaskDescription } from '../model';

export abstract class TaskPresenter<TD extends TaskDescription> {
  protected presentedTaskDescriptions: TD[] = [];
  protected currentTaskDescriptionIndex = 0;
  protected summary = { correct: 0, incorrect: 0 };
  protected isRepeating = false;

  private incorrectlyAnsweredTaskDescriptions: TD[] = [];
  private _onAnswered?: (result: Result) => void;
  private _onFinished?: () => void;

  constructor(protected allTaskDescriptions: TD[]) {}

  public start(presentedTaskDescriptions: TD[]) {
    this.summary = { correct: 0, incorrect: 0 };
    if (presentedTaskDescriptions.length === 0) {
      this.presentedTaskDescriptions = [];
      this.currentTaskDescriptionIndex = 0;
      this.isRepeating = false;
      console.log('No taskDescriptions available.');
      return;
    }
    this.startRun(presentedTaskDescriptions, false);
  }

  private startRun(taskDescriptions: TD[], isRepeating: boolean) {
    this.presentedTaskDescriptions = taskDescriptions;
    this.currentTaskDescriptionIndex = 0;
    this.isRepeating = isRepeating;
    this.incorrectlyAnsweredTaskDescriptions = [];
    this.loadTaskDescription();
    this.render();
  }
  protected get currentTaskDescription(): TD {
    return this.presentedTaskDescriptions[this.currentTaskDescriptionIndex];
  }

  protected nextTaskDescription() {
    this.currentTaskDescriptionIndex += 1;
    if (
      this.currentTaskDescriptionIndex >= this.presentedTaskDescriptions.length
    ) {
      if (this.incorrectlyAnsweredTaskDescriptions.length > 0) {
        this.startRun(this.incorrectlyAnsweredTaskDescriptions, true);
        return;
      }
      this.finish();
      return;
    }
    this.loadTaskDescription();
    this.render();
  }

  protected updateSummary() {
    const isCorrect = this.isCurrentTaskDescriptionAnsweredCorrectly();
    if (!isCorrect) {
      this.incorrectlyAnsweredTaskDescriptions.push(
        this.currentTaskDescription,
      );
    }
    if (this.isRepeating) {
      return;
    }
    if (isCorrect) {
      this.summary.correct += 1;
    } else {
      this.summary.incorrect += 1;
    }
    const wasConfusedWith = this.currentTaskDescriptionWasConfusedWith();
    this.onAnswered?.({
      id: this.currentTaskDescription.id,
      correctness: isCorrect ? 1 : 0,
      ...(wasConfusedWith.length > 0 && { wasConfusedWith }),
    });
  }

  public set onAnswered(handler: ((result: Result) => void) | undefined) {
    this._onAnswered = handler;
  }

  public set onFinished(handler: (() => void) | undefined) {
    this._onFinished = handler;
  }

  public get onAnswered() {
    return this._onAnswered;
  }

  public get onFinished() {
    return this._onFinished;
  }

  protected abstract isCurrentTaskDescriptionAnsweredCorrectly(): boolean;

  protected abstract currentTaskDescriptionWasConfusedWith(): string[];

  protected abstract loadTaskDescription(): void;

  protected abstract render(): void;

  protected abstract finish(): void;
}
