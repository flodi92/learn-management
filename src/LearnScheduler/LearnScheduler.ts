import { getMasteries } from './LearnScheduler.utils/getMasteries';
import {
  learningInProgressMasteryMax,
  learningInProgressMasteryMin,
  milisecondsPerDay,
  repeatSubjectsMasteryMax,
} from './LearningScheduler.constants';

export class LearnScheduler {
  constructor(private subjects: string[]) {}
  private results: { id: string; time: number; correctness: number }[] = [];

  get today(): number {
    return Date.now() / milisecondsPerDay;
  }

  private getSubjectStatisticsAt(time: number): Record<
    string,
    {
      mastery: number;
      lastRepetition?: number;
      lastMastery: number;
      lastCorrectness: number;
    }
  > {
    return Object.fromEntries(
      Array.from(new Set(this.subjects)).map((id) => {
        const relevantResults = this.results
          .filter((result) => result.id === id && result.time <= time)
          .sort((a, b) => a.time - b.time);

        const lastResult = relevantResults[relevantResults.length - 1];
        const lastRepetition = lastResult ? lastResult.time : undefined;
        const lastCorrectness = lastResult ? lastResult.correctness : 0;

        const mastery =
          relevantResults.length > 0
            ? (getMasteries(relevantResults, time)[id] ?? 0)
            : 0;

        const lastMastery =
          lastRepetition !== undefined && lastRepetition > 0
            ? (getMasteries(
                relevantResults.filter(
                  (result) => result.time <= lastRepetition,
                ),
                lastRepetition,
              )[id] ?? 0)
            : 0;

        return [
          id,
          {
            mastery,
            lastRepetition,
            lastMastery,
            lastCorrectness,
          },
        ];
      }),
    );
  }

  nextSession(count: number, time: number): string[] {
    if (count <= 0) {
      return [];
    }

    const subjectStatistics = this.getSubjectStatisticsAt(time);

    const learningInProgressSubjects = this.subjects.filter((id) => {
      const { mastery, lastMastery } = subjectStatistics[id];
      return (
        mastery > learningInProgressMasteryMin &&
        mastery < learningInProgressMasteryMax &&
        lastMastery < learningInProgressMasteryMax
      );
    });

    const repeatSubjects = this.subjects.filter((id) => {
      const { mastery, lastMastery } = subjectStatistics[id];
      return (
        lastMastery > learningInProgressMasteryMax &&
        mastery < repeatSubjectsMasteryMax
      );
    });

    const repeatWrongSubjects = this.subjects.filter((id) => {
      const { lastCorrectness, lastRepetition } = subjectStatistics[id];
      return lastRepetition !== undefined && lastCorrectness <= 0.5;
    });

    const newSubjects = this.subjects.filter(
      (id) => subjectStatistics[id].mastery < learningInProgressMasteryMin,
    );

    const subjects = Array.from(
      new Set([
        ...learningInProgressSubjects,
        ...repeatSubjects,
        ...repeatWrongSubjects,
      ]),
    ).slice(0, count);

    if (subjects.length < count) {
      subjects.push(...newSubjects.slice(0, count - subjects.length));
    }

    return subjects;
  }

  recordResults(results: Record<string, number>, time: number = this.today) {
    for (const [id, correctness] of Object.entries(results)) {
      if (!this.subjects.includes(id)) {
        continue;
      }

      if (correctness < 0 || correctness > 1) {
        throw new Error(
          `correctness for subject ${id} must be between 0 and 1 inclusive`,
        );
      }

      this.results.push({ id, time, correctness });
    }
  }

  get lastCorrectness(): Record<string, number> {
    const subjectStatistics = this.getSubjectStatisticsAt(this.today);
    return Object.fromEntries(
      this.subjects.map((id) => [id, subjectStatistics[id].lastCorrectness]),
    );
  }

  get mastery(): Record<string, number> {
    const subjectStatistics = this.getSubjectStatisticsAt(this.today);
    return Object.fromEntries(
      this.subjects.map((id) => [id, subjectStatistics[id].mastery]),
    );
  }

  get lastRepetition(): Record<string, number | undefined> {
    const subjectStatistics = this.getSubjectStatisticsAt(this.today);
    return Object.fromEntries(
      this.subjects.map((id) => [id, subjectStatistics[id].lastRepetition]),
    );
  }

  get lastMastery(): Record<string, number> {
    const subjectStatistics = this.getSubjectStatisticsAt(this.today);
    return Object.fromEntries(
      this.subjects.map((id) => [id, subjectStatistics[id].lastMastery]),
    );
  }

  get subjectStatistics() {
    return this.getSubjectStatisticsAt(this.today);
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
