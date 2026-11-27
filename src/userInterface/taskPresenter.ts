import { Result, TaskDescription } from '../model';

export abstract class TaskPresenter<TD extends TaskDescription> {
  protected presentedTaskDescriptions: TD[] = [];
  protected currentTaskDescriptionIndex = 0;
  protected summary = { correct: 0, incorrect: 0 };

  private _onAnswered?: (result: Result) => void;
  private _onFinished?: () => void;

  constructor(protected allTaskDescriptions: TD[]) {}

  public start(presentedTaskDescriptions: TD[]) {
    this.presentedTaskDescriptions = presentedTaskDescriptions;
    this.currentTaskDescriptionIndex = 0;
    this.summary = { correct: 0, incorrect: 0 };
    if (this.presentedTaskDescriptions.length === 0) {
      console.log('No taskDescriptions available.');
      return;
    }
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
      this.finish();
      return;
    }
    this.loadTaskDescription();
    this.render();
  }

  protected updateSummary() {
    const isCorrect = this.isCurrentTaskDescriptionAnsweredCorrectly();
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
