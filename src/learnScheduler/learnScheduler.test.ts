import { TaskDescription, TimedResult } from '../model';
import { LearnScheduler } from './learnScheduler';
import { convertDayToTimestamp } from '../utils';

const sessionIds = (
  tasks: TaskDescription[],
  results: TimedResult[],
  count: number,
  day: number,
) => {
  const scheduler = new LearnScheduler(tasks);
  scheduler.restoreFromSaveData(results);
  return scheduler
    .nextSession(count, convertDayToTimestamp(day))
    .map((task) => task.id);
};

const perfect = (id: string, days = [0, 1, 3, 7]) =>
  days.map((day) => ({
    id,
    timestamp: convertDayToTimestamp(day),
    correctness: 1,
  }));

describe('LearnScheduler', () => {
  it('fills the session with introductions beyond the learning limit and excludes repetitions on the same calendar day', () => {
    const tasks = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id }));
    const scheduler = new LearnScheduler(tasks);
    expect(
      scheduler.nextSession(4, convertDayToTimestamp(0)).map((task) => task.id),
    ).toEqual(['a', 'b', 'c', 'd']);
    scheduler.recordResults(
      { a: 1, b: 1, c: 1, d: 1 },
      convertDayToTimestamp(0.1),
    );
    expect(
      scheduler
        .nextSession(4, convertDayToTimestamp(0.9))
        .map((task) => task.id),
    ).toEqual(['e']);
    expect(
      scheduler.nextSession(4, convertDayToTimestamp(1)).map((task) => task.id),
    ).toEqual(['a', 'b', 'c', 'd']);
    expect(scheduler.nextSession(0, convertDayToTimestamp(1))).toEqual([]);
    expect(scheduler.nextSession(1.9, convertDayToTimestamp(1))).toHaveLength(
      1,
    );
    expect(
      new LearnScheduler(tasks).nextSession(2.1, convertDayToTimestamp(0)),
    ).toHaveLength(2);
  });

  it('prioritizes due learning over due learnt tasks over introductions', () => {
    const tasks = ['a', 'b', 'c'].map((id) => ({ id }));
    const results = [
      ...perfect('a'),
      { id: 'b', timestamp: convertDayToTimestamp(27), correctness: 1 },
    ];
    expect(sessionIds(tasks, results, 3, 29)).toEqual(['b', 'a', 'c']);
    expect(sessionIds(tasks, results, 1, 29)).toEqual(['b']);
  });

  it('orders equally urgent learning tasks by effective relevance then complexity', () => {
    const tasks = [
      { id: 'a', relevance: 2, complexity: 1 },
      { id: 'b', relevance: 1, complexity: 2 },
      { id: 'c', relevance: 1, complexity: 1 },
      { id: 'd' },
    ];
    const results = tasks.map(({ id }) => ({
      id,
      timestamp: convertDayToTimestamp(0),
      correctness: 1,
    }));
    expect(sessionIds(tasks, results, 4, 1)).toEqual(['c', 'b', 'a', 'd']);
  });

  it('uses inherited repetitions for same-day exclusion and the learning limit', () => {
    const tasks = [{ id: 'a' }, { id: 'b', parents: ['a'] }, { id: 'c' }];
    expect(
      sessionIds(
        tasks,
        [{ id: 'b', timestamp: convertDayToTimestamp(0.2), correctness: 1 }],
        4,
        0.8,
      ),
    ).toEqual(['c']);
    expect(
      sessionIds(
        tasks,
        [{ id: 'b', timestamp: convertDayToTimestamp(0.2), correctness: 1 }],
        4,
        1.2,
      ),
    ).toEqual(['a', 'b', 'c']);
  });

  it('prefers repeating introduced tasks over introductions beyond the learning limit', () => {
    const tasks = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id }));
    expect(sessionIds(tasks, perfect('a'), 4, 8)).toEqual(['b', 'c', 'a', 'd']);
  });

  it('unblocks introductions after dropout but preserves their history', () => {
    const tasks = [{ id: 'z' }, { id: 'b' }];
    expect(
      sessionIds(
        tasks,
        [{ id: 'z', timestamp: convertDayToTimestamp(0), correctness: 1 }],
        1,
        1,
      ),
    ).toEqual(['z']);
    expect(
      sessionIds(
        tasks,
        [{ id: 'z', timestamp: convertDayToTimestamp(0), correctness: 1 }],
        1,
        30,
      ),
    ).toEqual(['b']);
  });

  it('orders introductions globally by relevance and within categories by complexity', () => {
    const tasks = [
      { id: 'a', relevance: 1, complexity: 1, categories: ['x'] },
      { id: 'b', relevance: 1, complexity: 2, categories: ['x'] },
      { id: 'c', relevance: 2, complexity: 1, categories: ['y'] },
      { id: 'd', relevance: 1, complexity: 2, categories: ['y'] },
    ];
    expect(sessionIds(tasks, [], 10, 0)).toEqual(['a', 'd']);
    expect(
      sessionIds(tasks, [...perfect('a'), ...perfect('d')], 10, 8),
    ).toEqual(['b', 'a', 'd']);
    expect(
      sessionIds(
        tasks,
        [...perfect('a'), ...perfect('b'), ...perfect('d')],
        10,
        8,
      ),
    ).toEqual(['c', 'd', 'a', 'b']);
  });

  it('gives subject prerequisites precedence over relevance and complexity', () => {
    const tasks = [
      {
        id: 'base',
        subjects: ['x'],
        relevance: 9,
        complexity: 9,
        categories: ['c'],
      },
      {
        id: 'same',
        subjects: ['x'],
        relevance: 9,
        complexity: 9,
        categories: ['c'],
      },
      {
        id: 'combined',
        subjects: ['x', 'y'],
        relevance: 1,
        complexity: 1,
        categories: ['c'],
      },
      { id: 'other', subjects: ['z'], relevance: 2 },
    ];
    expect(sessionIds(tasks, [], 10, 0)).toEqual(['base', 'same']);
    expect(sessionIds(tasks, perfect('base'), 10, 8)).toEqual(['same', 'base']);
    expect(
      sessionIds(tasks, [...perfect('base'), ...perfect('same')], 10, 8),
    ).toEqual(['combined', 'base', 'same']);
  });

  it('prefers the strongest reciprocal relationship among equally ranked introductions', () => {
    const tasks = [
      { id: 'anchor', equalTo: ['z'], confusedWith: ['y'], categories: ['x'] },
      { id: 'a', categories: ['x'] },
      { id: 'y' },
      { id: 'z' },
    ];
    expect(
      sessionIds(
        tasks,
        [{ id: 'anchor', timestamp: convertDayToTimestamp(0), correctness: 1 }],
        8,
        1,
      ),
    ).toEqual(['anchor', 'z', 'y', 'a']);
  });

  it('applies the category relevance exception to related fill candidates', () => {
    const tasks = [
      { id: 'anchor', equalTo: ['z'], confusedWith: ['b'] },
      { id: 'a', relevance: 1, categories: ['x'] },
      { id: 'b', relevance: 2, categories: ['x'] },
      { id: 'z', relevance: 2, categories: ['x'] },
    ];
    const results = [
      ...perfect('a', [0, 1, 3, 7.9]),
      { id: 'anchor', timestamp: convertDayToTimestamp(7), correctness: 1 },
      { id: 'b', timestamp: convertDayToTimestamp(7.9), correctness: 1 },
      { id: 'z', timestamp: convertDayToTimestamp(7.9), correctness: 1 },
    ];
    expect(sessionIds(tasks, results, 4, 8.1)).toEqual([
      'anchor',
      'b',
      'a',
      'z',
    ]);
  });

  it('recomputes relatedness after each introduction', () => {
    const tasks = [
      { id: 'a', equalTo: ['z'] },
      { id: 'b' },
      { id: 'y', confusedWith: ['z'] },
      { id: 'z' },
    ];
    expect(sessionIds(tasks, [], 8, 0)).toEqual(['a', 'z', 'y', 'b']);
  });

  it('never uses relatedness to bypass introduction prerequisites', () => {
    const tasks = [
      { id: 'anchor', equalTo: ['combined'] },
      { id: 'base', subjects: ['x'] },
      { id: 'combined', subjects: ['x', 'y'] },
    ];
    expect(
      sessionIds(
        tasks,
        [{ id: 'anchor', timestamp: convertDayToTimestamp(0), correctness: 1 }],
        6,
        1,
      ),
    ).toEqual(['anchor', 'base']);
  });

  it('fills only with introduced non-due items and prefers related items', () => {
    const tasks = [{ id: 'anchor', equalTo: ['z'] }, { id: 'a' }, { id: 'z' }];
    const results = [
      { id: 'anchor', timestamp: convertDayToTimestamp(0), correctness: 1 },
      { id: 'a', timestamp: convertDayToTimestamp(0.9), correctness: 1 },
      { id: 'z', timestamp: convertDayToTimestamp(0.95), correctness: 1 },
    ];
    expect(sessionIds(tasks, results, 3, 1)).toEqual(['anchor', 'z', 'a']);
  });

  it('prefers nearly due items over lower-recall items when filling', () => {
    const tasks = [{ id: 'anchor' }, { id: 'learning' }, { id: 'learnt' }];
    const results = [
      ...perfect('learnt'),
      { id: 'anchor', timestamp: convertDayToTimestamp(24), correctness: 1 },
      {
        id: 'learning',
        timestamp: convertDayToTimestamp(24.9),
        correctness: 1,
      },
    ];
    expect(sessionIds(tasks, results, 3, 25.1)).toEqual([
      'anchor',
      'learning',
      'learnt',
    ]);
  });

  it('schedules due repetitions at the specified perfect-answer intervals', () => {
    const scheduler = new LearnScheduler([{ id: 'a' }]);
    for (const day of [0, 1, 3, 7, 29, 79]) {
      expect(
        scheduler
          .nextSession(1, convertDayToTimestamp(day))
          .map((task) => task.id),
      ).toEqual(['a']);
      scheduler.recordResults({ a: 1 }, convertDayToTimestamp(day));
      expect(scheduler.nextSession(1, convertDayToTimestamp(day))).toEqual([]);
    }
  });

  it('is deterministic irrespective of input order and does not mutate saved results', () => {
    const tasks = [{ id: 'c' }, { id: 'a' }, { id: 'b' }];
    const results = [
      { id: 'a', timestamp: convertDayToTimestamp(1), correctness: 1 },
      { id: 'a', timestamp: convertDayToTimestamp(0), correctness: 1 },
    ];
    const original = results.slice();
    const first = sessionIds(tasks, results, 4, 2);
    expect(sessionIds([...tasks].reverse(), results, 4, 2)).toEqual(first);
    expect(sessionIds(tasks, results, 4, 2)).toEqual(first);
    expect(results).toEqual(original);
  });

  it('exposes replayed statistics through the public getters after restoring results', () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date(2 * 24 * 60 * 60 * 1000));
      const scheduler = new LearnScheduler([
        { id: 'parent' },
        { id: 'child', parents: ['parent'] },
      ]);
      const results = [
        { id: 'child', timestamp: convertDayToTimestamp(1), correctness: 0.8 },
      ];
      scheduler.restoreFromSaveData(results);
      expect(scheduler.getSaveData()).toEqual(results);
      expect(scheduler.lastRepetition).toEqual({
        parent: convertDayToTimestamp(1),
        child: convertDayToTimestamp(1),
      });
      expect(scheduler.lastCorrectness).toEqual({ parent: 0.8, child: 0.8 });
      expect(scheduler.lastMastery).toEqual({ parent: 0.9, child: 0.9 });
      expect(scheduler.mastery.parent).toBeCloseTo(scheduler.mastery.child);
      expect(scheduler.mastery.parent).toBeGreaterThan(0);
      expect(scheduler.mastery.parent).toBeLessThan(0.9);
    } finally {
      vi.useRealTimers();
    }
  });

  it('records a result together with the ids of the task descriptions it was confused with', () => {
    const scheduler = new LearnScheduler([
      { id: 'a', confusedWith: ['b'] },
      { id: 'b' },
    ]);
    scheduler.recordResult(
      { id: 'a', correctness: 0, wasConfusedWith: ['b'] },
      convertDayToTimestamp(3),
    );
    scheduler.recordResult(
      { id: 'b', correctness: 1 },
      convertDayToTimestamp(3),
    );
    scheduler.recordResult(
      { id: 'unknown', correctness: 1 },
      convertDayToTimestamp(3),
    );
    expect(scheduler.getSaveData()).toEqual([
      {
        id: 'a',
        timestamp: convertDayToTimestamp(3),
        correctness: 0,
        wasConfusedWith: ['b'],
      },
      { id: 'b', timestamp: convertDayToTimestamp(3), correctness: 1 },
    ]);
    expect(() => scheduler.recordResult({ id: 'a', correctness: 2 })).toThrow();
  });
});
