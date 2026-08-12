import { getConsciousness, Result } from './getConsciousness';

const subjects = ['a', 'b', 'c', 'd', 'e'];

class LearnScheduler {
  constructor(subjects: string[]) {}

  nextSession(count: number, time: number): string[] {
    throw 'not implemented';
  }

  recordResults(results: Record<string, number>, time: number) {
    throw 'not implemented';
  }

  get consciousness(): Record<string, number> {
    throw 'not implemented';
  }
}

const LearnSchedulerTestWrapper = (
  learningTimes: number[],
  subjects: string[],
  doSession: (
    time: number,
    index: number,
    session: ReturnType<LearnScheduler['nextSession']>,
  ) => Parameters<LearnScheduler['recordResults']>[0],
  checkSession: (
    time: number,
    index: number,
    consciousnesses: Record<string, number>,
    session: string[],
    results: Result[],
  ) => void,
  doFinal: (scheduler: LearnScheduler) => void,
) => {
  const scheduler = new LearnScheduler(subjects);
  const results: { id: string; time: number; correctness: number }[] = [];
  learningTimes.forEach((time, index) => {
    const sessionResults = doSession(
      time,
      index,
      scheduler.nextSession(10, time),
    );

    scheduler.recordResults(sessionResults, time);

    Object.entries(sessionResults).forEach(([id, correctness]) =>
      results.push({ correctness, id, time }),
    );

    Array.from(new Set(results.map((result) => result.id)))
      .map(
        (id) =>
          [
            id,
            results
              .filter((result) => result.id === id)
              .map(({ correctness, time: _time }) => ({
                correctness,
                beforeDays: time - _time,
              })),
          ] as const,
      )
      .map(([id, results]) => [id, getConsciousness(results)]);
  });

  doFinal(scheduler);
};

describe('LearnScheduler', () => {
  const learningTimes = Array.from({ length: 10 }).map((_, i) => i);
  const subjects = Array.from({ length: 100 }).map((_, i) => `${i}`);

  it('limits number of learning in progress subjects', () =>
    LearnSchedulerTestWrapper(
      learningTimes,

      subjects,

      (time, index, session) =>
        Object.fromEntries(session.map((task) => [task, 0.5])),

      (time, index, consciousnesses) => {
        expect(Object.values(consciousnesses).length).toEqual(100);
        expect(
          Object.values(consciousnesses).filter(
            (value) => value > 0.1 && value < 0.8,
          ).length,
        ).toBeLessThan(10);
      },
      () => {},
    ));

  it('assures constant repetition of currently learnt tasks', () => {
    let checkForNextSession: string[] = [];
    LearnSchedulerTestWrapper(
      learningTimes,

      subjects,

      (time, index, session) =>
        Object.fromEntries(session.map((task) => [task, 0.5])),

      (time, index, consciousnesses, session) => {
        expect(checkForNextSession.every((task) => session.includes(task)));
        checkForNextSession = session.filter(
          (task) => consciousnesses[task] > 0.1 && consciousnesses[task] < 0.8,
        );
      },
      () => {},
    );
  });
});
