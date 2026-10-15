import { LearnSubject, Result } from '../model';

export abstract class TaskPresenter<Task extends LearnSubject> {
  abstract set onAnswered(handler: (result: Result) => void);
  abstract set onFinished(handler: () => void);

  abstract start(tasks: Task[]): void;
}
