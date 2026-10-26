import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { Overview } from '../../../userInterface/overview';
import { LearnSubject, TimedResult } from '../../../model';
import { computeStatistics } from '../../../progressOverview/progressOverview.utils/progressOverview.computeStatistics';
import { getToday } from '../../../utils';
import { ProgressOverview } from '../../../progressOverview/progressOverview';

export class ConsoleOverview extends Overview {
  async showStatistics(
    idSubjectMapping: Record<string, LearnSubject>,
    results: TimedResult[],
  ): Promise<void> {
    const statistics = computeStatistics(
      idSubjectMapping,
      results,
      getToday(),
      (id) => id,
    );
    const overview = new ProgressOverview();
    await overview.display(statistics);
  }
  async askForNumberOfTasks(): Promise<number> {
    const readline = createInterface({ input: stdin, output: stdout });
    try {
      while (true) {
        const answer = await readline.question(
          'How many questions do you want to examine today? ',
        );
        const parsedAnswer = Number(answer);

        if (Number.isInteger(parsedAnswer) && parsedAnswer > 0) {
          return parsedAnswer;
        }
        console.log('Please enter a positive whole number.');
      }
    } finally {
      readline.close();
    }
  }

  async showSessionFinishedView(): Promise<void> {
    const readline = createInterface({ input: stdin, output: stdout });

    try {
      await readline.question(
        'Session finished. Press Enter to start a new session.\n',
      );
    } finally {
      readline.close();
    }
  }
}
