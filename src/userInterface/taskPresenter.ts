import { Result, TaskDescription } from '../model';

export abstract class TaskPresenter<TD extends TaskDescription> {
  abstract set onAnswered(handler: (result: Result) => void);
  abstract set onFinished(handler: () => void);

  abstract start(taskDescriptions: TD[]): void;
}
