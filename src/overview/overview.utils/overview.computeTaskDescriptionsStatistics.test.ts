import { TaskDescription, TimedResult } from '../../model';
import { computeTaskDescriptionsStatistics } from './overview.computeTaskDescriptionsStatistics';
import { convertDayToTimestamp } from '../../utils';

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
        timestamp: convertDayToTimestamp(day),
        correctness: 1,
      })),
      { id: 'child', timestamp: convertDayToTimestamp(8), correctness: 0 },
      { id: 'learning', timestamp: convertDayToTimestamp(14), correctness: 1 },
      { id: 'dropped', timestamp: convertDayToTimestamp(0), correctness: 1 },
      { id: 'new', timestamp: convertDayToTimestamp(16), correctness: 1 },
    ];
    const items = Object.fromEntries(
      computeTaskDescriptionsStatistics(
        tasks,
        results,
        convertDayToTimestamp(15),
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
      lastRepetitionBefore: convertDayToTimestamp(7),
      lastMastery: 0.5,
      lastCorrectness: 0,
    });
    expect(items.parent.mastery).toBeCloseTo(items.child.mastery);
    expect(items.learning.learningState).toBe('learning');
    expect(items.dropped.learningState).toBe('notLearned');
    expect(items.dropped.lastRepetitionBefore).toBe(convertDayToTimestamp(15));
    expect(items.new).toMatchObject({
      learningState: 'notLearned',
      numberOfRepetitions: 0,
      mastery: 0,
      lastRepetitionBefore: Infinity,
    });
  });

  it('reports learnt states before and after the recall threshold', () => {
    const tasks = { a: { id: 'a' } };
    const results = [0, 1, 3, 7].map((day) => ({
      id: 'a',
      timestamp: convertDayToTimestamp(day),
      correctness: 1,
    }));
    expect(
      computeTaskDescriptionsStatistics(
        tasks,
        results,
        convertDayToTimestamp(8),
        (id) => id,
      )[0][2].learningState,
    ).toBe('learned');
    expect(
      computeTaskDescriptionsStatistics(
        tasks,
        results,
        convertDayToTimestamp(29),
        (id) => id,
      )[0][2].learningState,
    ).toBe('forRepeat');
  });

  it('lists the examinations counted as repetitions, the most recent first, with the confusions as labels', () => {
    const tasks: Record<string, TaskDescription> = {
      a: { id: 'a' },
      b: { id: 'b' },
      c: { id: 'c', parents: ['a'] },
    };
    const results: TimedResult[] = [
      { id: 'a', timestamp: convertDayToTimestamp(1), correctness: 1 },
      {
        id: 'a',
        timestamp: convertDayToTimestamp(5),
        correctness: 0,
        wasConfusedWith: ['b', 'removed'],
      },
      { id: 'c', timestamp: convertDayToTimestamp(7.5), correctness: 1 },
      { id: 'a', timestamp: convertDayToTimestamp(11), correctness: 1 },
    ];
    const items = Object.fromEntries(
      computeTaskDescriptionsStatistics(
        tasks,
        results,
        convertDayToTimestamp(10),
        (id) => `Label ${id}`,
      ).map(([id, , statistics]) => [id, statistics]),
    );

    // The result of c is inherited by its parent a, the result after the day is ignored
    expect(items.a.examinations).toEqual([
      {
        examinedBefore: convertDayToTimestamp(2.5),
        correctness: 1,
        wasConfusedWith: [],
      },
      {
        examinedBefore: convertDayToTimestamp(5),
        correctness: 0,
        // The id of a taskDescription that does not exist anymore has no label
        wasConfusedWith: ['Label b', 'removed'],
      },
      {
        examinedBefore: convertDayToTimestamp(9),
        correctness: 1,
        wasConfusedWith: [],
      },
    ]);
    expect(items.a.examinations).toHaveLength(items.a.numberOfRepetitions);
    expect(items.c.examinations).toEqual([
      {
        examinedBefore: convertDayToTimestamp(2.5),
        correctness: 1,
        wasConfusedWith: [],
      },
    ]);
    expect(items.b.examinations).toEqual([]);
  });
});
