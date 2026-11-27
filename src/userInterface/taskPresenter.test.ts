import { Result, TaskDescription } from '../model';
import { TaskPresenter } from './taskPresenter';

class TestPresenter extends TaskPresenter<TaskDescription> {
  presented: { id: string; isRepeating: boolean }[] = [];
  answers: Record<string, boolean[]> = {};
  finished = vi.fn();

  protected isCurrentTaskDescriptionAnsweredCorrectly() {
    const queue = this.answers[this.currentTaskDescription.id];
    return queue.shift() ?? true;
  }

  protected currentTaskDescriptionWasConfusedWith() {
    return [];
  }

  protected loadTaskDescription() {}

  protected render() {
    this.presented.push({
      id: this.currentTaskDescription.id,
      isRepeating: this.isRepeating,
    });
  }

  protected finish() {
    this.finished();
    this.onFinished?.();
  }

  answerCurrentAndContinue() {
    this.updateSummary();
    this.nextTaskDescription();
  }

  getSummary() {
    return this.summary;
  }
}

const createTaskDescriptions = (ids: string[]) =>
  ids.map((id) => ({ id, categories: ['category'] }));

describe('TaskPresenter', () => {
  it('repeats incorrectly answered task descriptions until all are correct', () => {
    const taskDescriptions = createTaskDescriptions(['a', 'b', 'c']);
    const presenter = new TestPresenter(taskDescriptions);
    presenter.answers = {
      a: [true],
      b: [false, false, true],
      c: [false, true],
    };
    const results: Result[] = [];
    presenter.onAnswered = (result) => results.push(result);

    presenter.start(taskDescriptions);
    for (let i = 0; i < 6; i++) presenter.answerCurrentAndContinue();

    expect(presenter.presented).toEqual([
      { id: 'a', isRepeating: false },
      { id: 'b', isRepeating: false },
      { id: 'c', isRepeating: false },
      { id: 'b', isRepeating: true },
      { id: 'c', isRepeating: true },
      { id: 'b', isRepeating: true },
    ]);
    expect(presenter.finished).toHaveBeenCalledTimes(1);
  });

  it('does not call onAnswered and does not alter the summary in repetition runs', () => {
    const taskDescriptions = createTaskDescriptions(['a', 'b']);
    const presenter = new TestPresenter(taskDescriptions);
    presenter.answers = { a: [true], b: [false, false, true] };
    const results: Result[] = [];
    presenter.onAnswered = (result) => results.push(result);

    presenter.start(taskDescriptions);
    for (let i = 0; i < 4; i++) presenter.answerCurrentAndContinue();

    expect(results).toEqual([
      { id: 'a', correctness: 1 },
      { id: 'b', correctness: 0 },
    ]);
    expect(presenter.getSummary()).toEqual({ correct: 1, incorrect: 1 });
    expect(presenter.finished).toHaveBeenCalledTimes(1);
  });

  it('finishes without repetition when everything is answered correctly', () => {
    const taskDescriptions = createTaskDescriptions(['a', 'b']);
    const presenter = new TestPresenter(taskDescriptions);
    presenter.answers = { a: [], b: [] };

    presenter.start(taskDescriptions);
    presenter.answerCurrentAndContinue();
    presenter.answerCurrentAndContinue();

    expect(presenter.presented.every(({ isRepeating }) => !isRepeating)).toBe(
      true,
    );
    expect(presenter.finished).toHaveBeenCalledTimes(1);
  });
});
