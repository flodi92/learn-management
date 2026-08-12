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

describe('LearnScheduler', () => {
  it('limits number of learning in progress subjects', () => {
    const subjects = Array.from({ length: 100 }).map((i) => `${i}`);
    const scheduler = new LearnScheduler(subjects);

    for (let i = 0; i < 10; i++) {
      const session = scheduler.nextSession(10, i);
      scheduler.recordResults(
        Object.fromEntries(session.map((task) => [task, 0.5])),
        i,
      );

      expect(Object.values(scheduler.consciousness).length).toEqual(100);
      expect(
        Object.values(scheduler.consciousness).filter(
          (value) => value > 0.1 && value < 0.8,
        ).length,
      ).toBeLessThan(10);
    }
  });
});
