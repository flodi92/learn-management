export class LearnScheduler {
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
