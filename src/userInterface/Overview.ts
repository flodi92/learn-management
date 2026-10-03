export abstract class Overview {
  abstract askForQuestions(): Promise<number>;
  abstract showSessionFinishedView(): Promise<void>;
}
