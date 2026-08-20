export class LearnScheduler {
  constructor(subjects: string[]) {}
  private results: { id: string; time: number; correctness: number }[] = [];
  nextSession(count: number, time: number): string[] {
    // schedule learning in progress subjects which are the ones with low mastery
    // fill in all items that already had a high mastery but their value has already sunk to 0.6 or lower
    // fill in new items that had not been examined before
    // take all items that have been incorrectly answered during the last session
    throw 'not implemented';
  }

  recordResults(results: Record<string, number>, time: number) {
    throw 'not implemented';
  }

  get mastery(): Record<string, number> {
    throw 'not implemented';
  }
}

export class LearnSchedulerPattern {
  constructor(subjects: string[]) {}

  nextSession(count: number, time: number): string[] {
    throw 'not implemented';
  }

  recordResults(results: Record<string, number>, time: number) {
    throw 'not implemented';
  }

  get mastery(): Record<string, number> {
    throw 'not implemented';
  }
}
