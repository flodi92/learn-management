import { TaskDescription, TimedResult } from '../../model';
import { computeTaskDescriptionStatisticsAt } from './computeTaskDescriptionStatisticsAt';

const compute = (
  taskDescriptions: TaskDescription[],
  results: TimedResult[],
  day: number,
) =>
  computeTaskDescriptionStatisticsAt(
    day,
    Object.fromEntries(taskDescriptions.map((task) => [task.id, task])),
    results,
  );

describe('computeTaskDescriptionStatisticsAt', () => {
  it('replays perfect answers at their due dates and retains learnt status after failures', () => {
    const results = [0, 1, 3, 7, 29, 79].map((day) => ({
      id: 'a',
      day,
      correctness: 1,
    }));
    const expectedStabilities = [3.6, 7.2, 14.5, 29.2, 66.8, 152.7];
    results.forEach((result, index) => {
      const item = compute([{ id: 'a' }], results, result.day).a;
      expect(item.stability).toBeCloseTo(expectedStabilities[index], 0);
      expect(item.isLearnt).toBe(index >= 3);
      expect(item.learningState).toBe(index >= 3 ? 'learned' : 'learning');
      expect(item.lastMastery).toBe(1);
      if (index > 0) {
        expect(compute([{ id: 'a' }], results, result.day - 1).a.isDue).toBe(
          false,
        );
        expect(
          compute([{ id: 'a' }], results, result.day - 0.001).a.isDue,
        ).toBe(true);
      }
    });
    const failed = compute(
      [{ id: 'a' }],
      [...results.slice(0, 4), { id: 'a', day: 8, correctness: 0 }],
      9,
    ).a;
    expect(failed.isLearnt).toBe(true);
    expect(failed.learningState).toBe('forRepeat');
    expect(failed.isDue).toBe(true);
  });

  it('inherits each result once through a cyclic diamond and orders equal times stably', () => {
    const tasks = [
      { id: 'root', parents: ['leaf'] },
      { id: 'left', parents: ['root'] },
      { id: 'right', parents: ['root'] },
      { id: 'leaf', parents: ['left', 'right'] },
      { id: 'related', equalTo: ['leaf'], confusedWith: ['leaf'] },
    ];
    const items = compute(
      tasks,
      [
        { id: 'leaf', day: 2, correctness: 0 },
        { id: 'leaf', day: 1, correctness: 1 },
        { id: 'leaf', day: 2, correctness: 0.8 },
        { id: 'leaf', day: 3, correctness: 1 },
      ],
      2,
    );
    for (const id of ['root', 'left', 'right', 'leaf']) {
      expect(items[id].numberOfRepetitions).toBe(3);
      expect(items[id].lastRepetition).toBe(2);
      expect(items[id].lastCorrectness).toBe(0.8);
      expect(items[id].lastMastery).toBe(0.9);
    }
    expect(items.related.numberOfRepetitions).toBe(0);
    expect(items.related.stability).toBeUndefined();
    expect(items.related.mastery).toBe(0);
  });

  it('prevents same-day growth, applies failure and decays from last mastery', () => {
    const tasks = [{ id: 'a' }];
    const results = [
      { id: 'a', day: 0.1, correctness: 1 },
      { id: 'a', day: 0.9, correctness: 1 },
      { id: 'a', day: 1, correctness: 0 },
    ];
    expect(compute(tasks, results, 0.9).a.stability).toBeCloseTo(3.6);
    const item = compute(tasks, results, 2).a;
    expect(item.stability).toBeCloseTo(1.44);
    expect(item.lastMastery).toBe(0.5);
    expect(item.mastery).toBeCloseTo(0.5 * 2 ** (-1 / 1.44));
    expect(item.isDue).toBe(true);
  });

  it('drops abandoned learning items without erasing their history', () => {
    const tasks = [{ id: 'a' }];
    const results = [{ id: 'a', day: 0, correctness: 1 }];
    const dropped = compute(tasks, results, 30).a;
    expect(dropped.learningState).toBe('notLearned');
    expect(dropped.isDue).toBe(false);
    expect(dropped.numberOfRepetitions).toBe(1);
    const resumed = compute(
      tasks,
      [...results, { id: 'a', day: 30, correctness: 1 }],
      30,
    ).a;
    expect(resumed.numberOfRepetitions).toBe(2);
    expect(resumed.stability).toBeGreaterThan(10);
    expect(resumed.learningState).toBe('learning');
  });

  it('needs seven spaced answers of 0.8 to become learnt', () => {
    const tasks = [{ id: 'a' }];
    const results: TimedResult[] = [];
    for (let day = 0; results.length < 7; day++) {
      const item = compute(tasks, results, day).a;
      if (results.length === 0 || item.isDue) {
        results.push({ id: 'a', day, correctness: 0.8 });
        expect(compute(tasks, results, day).a.isLearnt).toBe(
          results.length === 7,
        );
      }
    }
  });

  it('interpolates partial answers and clamps stability to its bounds', () => {
    const tasks = [{ id: 'a' }];
    const half = compute(tasks, [{ id: 'a', day: 0, correctness: 0.5 }], 0).a;
    expect(half.stability).toBeCloseTo(2 * Math.sqrt(1.8 * 0.4));
    expect(half.lastMastery).toBe(0.75);
    const failures = Array.from({ length: 10 }, (_, day) => ({
      id: 'a',
      day,
      correctness: 0,
    }));
    expect(compute(tasks, failures, 9).a.stability).toBe(1);
    const successes = Array.from({ length: 30 }, (_, index) => ({
      id: 'a',
      day: index * 400,
      correctness: 1,
    }));
    expect(compute(tasks, successes, 11600).a.stability).toBe(365);
  });

  it('keeps low correctness in learning for a long sequence of due reviews', () => {
    const tasks = [{ id: 'a' }];
    const results: TimedResult[] = [];
    for (let day = 0; day < 40 && results.length < 10; day++) {
      const item = compute(tasks, results, day).a;
      if (results.length === 0 || item.isDue) {
        results.push({ id: 'a', day, correctness: 0.6 });
        expect(compute(tasks, results, day).a.isLearnt).toBe(false);
      }
    }
    expect(results.length).toBe(10);
  });
});
