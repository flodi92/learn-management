import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

export abstract class Overview {
  abstract askForNumberOfTasks(): Promise<number>;
  abstract showSessionFinishedView(): Promise<void>;
}

export class RegExpOverview extends Overview {
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
