import { getMasteries } from './LearnScheduler.utils/getMasteries';

export class LearnScheduler {
  constructor(private subjects: string[]) {}
  private results: { id: string; time: number; correctness: number }[] = [];

  get today(): number {
    // @todo number of days since January 1 1970 but allowing for floating point numbers if invoked not exactly at midnight
    throw 'not implemented';
  }

  nextSession(count: number, time: number): string[] {
    // schedule learning in progress subjects which are the ones with low mastery
    // fill in all items that already had a high mastery but their value has already sunk to 0.6 or lower
    // fill in new items that had not been examined before
    // take all items that have been incorrectly answered during the last session

    const learningInProgressItems = Object.entries(this.itemStatistics)
      .filter(
        ([id, { lastMastery, mastery }]) =>
          mastery > 0.1 && mastery < 0.8 && lastMastery < 0.8,
      )
      .map(([id]) => id);

    const repeatItems = Object.entries(this.itemStatistics)
      .filter(
        ([id, { mastery, lastMastery }]) => lastMastery > 0.8 && mastery < 0.6,
      )
      .map(([id]) => id);

    const repeatWrongItems = Object.entries(this.itemStatistics)
      .filter(([id, { lastCorrectness }]) => lastCorrectness <= 0.5)
      .map(([id]) => id);

    const newItems = Object.entries(this.itemStatistics)
      .filter(([id, { mastery }]) => mastery <= 0.1)
      .map(([id]) => id);

    const items = Array.from(
      new Set([
        ...learningInProgressItems,
        ...repeatItems,
        ...repeatWrongItems,
      ]),
    ).slice(0, count);

    items.push(...newItems.slice(0, count - items.length));

    return items;
  }

  recordResults(results: Record<string, number>, time: number = this.today) {
    // results is a mapping of item id to update this.results
    throw 'not implemented';
  }

  get lastCorrectness(): Record<string, number> {
    // correctness of every item on last repetition (with highest time)
    throw 'not implemented';
  }

  get mastery(): Record<string, number> {
    return getMasteries(this.results, this.today);
  }

  get lastRepetition(): Record<string, number> {
    // the highest time for every id of results
    throw 'not implemented';
  }

  get lastMastery(): Record<string, number> {
    const lastRepetition = this.lastRepetition;
    return Object.fromEntries(
      Object.entries(lastRepetition).map(([id, lastRepetitionTime]) => [
        id,
        getMasteries(
          this.results.filter(
            ({ time, id: _id }) => time <= lastRepetition[_id] && id === _id,
          ),
          lastRepetitionTime,
        )[id],
      ]),
    );
  }

  get itemStatistics(): Record<
    string,
    {
      mastery: number;
      lastRepetition: number;
      lastMastery: number;
      lastCorrectness: number;
    }
  > {
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
