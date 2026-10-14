export abstract class Overview {
  abstract askForNumberOfTasks(): Promise<number>;
  abstract showSessionFinishedView(): Promise<void>;
}
