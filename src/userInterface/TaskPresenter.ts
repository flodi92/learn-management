import { Result } from '../model';

export abstract class TaskPresenter<
  T extends { id: string; parentIds?: string[] },
> {
  abstract set onAnswered(handler: (result: Result) => void);
  abstract set onFinished(handler: () => void);

  abstract start(tasks: T[]): void;
}
