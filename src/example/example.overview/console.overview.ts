import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import {
  OverviewRecursiveStatistics,
  OverviewSelectionPath,
  OverviewTaskDescriptionSelection,
} from '../../overview/overview.model';
import { Overview } from '../../overview/overview';
import { consoleDisplayStatistics } from './console.displayStatistics/console.displayStatistics';
import { formatStatistics } from './console.displayStatisticsItem.utils/console.formatStatistics';
import { getStatisticsColor } from './console.displayStatisticsItem.utils/console.getStatisticsColor';
import { sortChildren } from './console.displayStatisticsItem.utils/console.sortChildren';
import { TaskDescription } from '../../model';

export class ConsoleOverview<
  TD extends TaskDescription = TaskDescription,
> extends Overview<TD> {
  constructor(getLabelFromId: (id: string) => string) {
    super(getLabelFromId);
  }
  async askForNumberOfTaskDescriptions(): Promise<number> {
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

  protected async displayComputedStatistics(
    statistics: OverviewRecursiveStatistics,
    toggleSelection: (path: OverviewSelectionPath) => void,
    taskDescriptionSelection: () => OverviewTaskDescriptionSelection,
  ): Promise<void> {
    await consoleDisplayStatistics(
      statistics,
      formatStatistics,
      getStatisticsColor,
      sortChildren,
      toggleSelection,
      taskDescriptionSelection,
    );
  }
}
