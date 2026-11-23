import { TaskDescription, TimedResult } from '../../model';
import { computeTaskDescriptionsStatistics } from './overview.computeTaskDescriptionsStatistics';

describe('computeTaskDescriptionsStatistics', () => {
  it('uses the scheduler memory model, inherited repetitions and learning states', () => {
    const tasks: Record<string, TaskDescription> = {
      parent: { id: 'parent' },
      child: { id: 'child', parents: ['parent'] },
      learning: { id: 'learning' },
      dropped: { id: 'dropped' },
      new: { id: 'new' },
    };
    const results: TimedResult[] = [
      ...[0, 1, 3, 7].map((day) => ({
        id: 'child',
        day,
        correctness: 1,
      })),
      { id: 'child', day: 8, correctness: 0 },
      { id: 'learning', day: 14, correctness: 1 },
      { id: 'dropped', day: 0, correctness: 1 },
      { id: 'new', day: 16, correctness: 1 },
    ];
    const items = Object.fromEntries(
      computeTaskDescriptionsStatistics(
        tasks,
        results,
        15,
        (id) => `Label ${id}`,
      ).map(([id, task, statistics]) => {
        expect(task).toBe(tasks[id]);
        return [id, statistics];
      }),
    );

    expect(items.parent).toMatchObject({
      id: 'parent',
      label: 'Label parent',
      learningState: 'forRepeat',
      numberOfRepetitions: 5,
      lastRepetitionBeforeDays: 7,
      lastMastery: 0.5,
      lastCorrectness: 0,
    });
    expect(items.parent.mastery).toBeCloseTo(items.child.mastery);
    expect(items.learning.learningState).toBe('learning');
    expect(items.dropped.learningState).toBe('notLearned');
    expect(items.dropped.lastRepetitionBeforeDays).toBe(15);
    expect(items.new).toMatchObject({
      learningState: 'notLearned',
      numberOfRepetitions: 0,
      mastery: 0,
      lastRepetitionBeforeDays: Infinity,
    });
  });

  it('reports learnt states before and after the recall threshold', () => {
    const tasks = { a: { id: 'a' } };
    const results = [0, 1, 3, 7].map((day) => ({
      id: 'a',
      day,
      correctness: 1,
    }));
    expect(
      computeTaskDescriptionsStatistics(tasks, results, 8, (id) => id)[0][2]
        .learningState,
    ).toBe('learned');
    expect(
      computeTaskDescriptionsStatistics(tasks, results, 29, (id) => id)[0][2]
        .learningState,
    ).toBe('forRepeat');
  });
});
