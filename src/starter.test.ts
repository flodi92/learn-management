import { Result, TaskDescription } from './model';
import { DisplayComputedStatistics } from './overview/overview.model';
import { Overview } from './overview/overview';
import { Starter } from './starter';
import { TaskPresenter } from './userInterface/taskPresenter';
import { millisecondsPerDay } from './utils.constants';
import { convertDayToTimestamp } from './utils';

describe('Starter', () => {
  it('suggests a session and displays statistics from the same scheduler history', async () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date(29 * millisecondsPerDay));
      const tasks = [
        { id: 'a', categories: ['category'] },
        { id: 'b', categories: ['category'] },
      ];
      const saved = [0, 1, 3, 7].map((day) => ({
        id: 'a',
        timestamp: convertDayToTimestamp(day),
        correctness: 1,
      }));
      const saveDataBase = {
        loadSaveData: vi.fn(() => [...saved]),
        saveData: vi.fn(),
      };
      const stop = new Error('stop after one session');

      class TestOverview extends Overview<TaskDescription> {
        askForNumberOfTaskDescriptions = vi.fn(async () => 2);
        showSessionFinishedView = vi.fn(async () => {
          throw stop;
        });
        displayComputedStatistics = vi.fn<DisplayComputedStatistics>(
          async () => {},
        );
      }

      class TestPresenter extends TaskPresenter<TaskDescription> {
        private answer: (result: Result) => void = () => {};
        private finish: () => void = () => {};

        set onAnswered(handler: (result: Result) => void) {
          this.answer = handler;
        }

        set onFinished(handler: () => void) {
          this.finish = handler;
        }

        start = vi.fn((session: TaskDescription[]) => {
          this.answer({ id: session[0].id, correctness: 0.8 });
          this.finish();
        });
      }

      const overview = new TestOverview((id) => id);
      const presenter = new TestPresenter();
      const starter = new Starter(presenter, tasks, saveDataBase, overview);
      await expect(starter.start()).rejects.toBe(stop);
      expect(presenter.start).toHaveBeenCalledWith(tasks);
      const statistics = overview.displayComputedStatistics.mock.calls[0][0];
      expect(statistics.statistics).toMatchObject({
        selected: 2,
        notLearned: 1,
        forRepeat: 1,
        learning: 0,
        learned: 0,
      });
      const children = statistics
        .getChildren('category')
        ?.category.getChildren('relevance')?.[1]
        .getChildren('taskDescription');
      expect(children?.a.statistics).toMatchObject({
        learningState: 'forRepeat',
        numberOfRepetitions: 4,
        lastRepetitionBefore: convertDayToTimestamp(22),
      });
      expect(children?.b.statistics).toMatchObject({
        learningState: 'notLearned',
        numberOfRepetitions: 0,
      });
      expect(saveDataBase.saveData).toHaveBeenCalledWith([
        ...saved,
        { id: 'a', timestamp: convertDayToTimestamp(29), correctness: 0.8 },
      ]);
    } finally {
      vi.useRealTimers();
    }
  });
});
