import { getMasteries } from './learnScheduler.utils/getMasteries';
import { prioritizeSubjects } from './learnScheduler.utils/prioritizeSubjects';
import {
  learningInProgressMasteryMax,
  learningInProgressMasteryMin,
  repeatSubjectsMasteryMax,
} from './learnScheduler.constants';
import { SaveData, Task, TimedResult } from '../model';
import { getToday } from '../utils';

export class LearnScheduler<T extends Task = Task> {
  private results: TimedResult[] = [];

  private idTaskMapping: Record<string, T>;

  private subjects: string[];

  private subjectsWithParents: Record<string, string[] | undefined>;

  constructor(tasks: T[]) {
    this.idTaskMapping = Object.fromEntries(
      tasks.map((task) => [task.id, task]),
    );
    this.subjects = tasks.map((task) => task.id);
    this.subjectsWithParents = Object.fromEntries(
      tasks.map((task) => [task.id, task.parentIds]),
    );
  }

  private isChildSubjectOf(childId: string, parentId: string) {
    return this.subjectsWithParents[childId]?.includes(parentId);
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
          .filter(
            (result) =>
              this.isChildSubjectOf(result.id, id) && result.time <= time,
          )
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

  nextSession(count: number, time: number = getToday()): T[] {
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

    const sessionSubjects = Array.from(
      new Set([
        ...learningInProgressSubjects,
        ...repeatSubjects,
        ...repeatWrongSubjects,
      ]),
    ).slice(0, count);

    if (sessionSubjects.length < count) {
      const newSubjects = this.subjects.filter(
        (id) => subjectStatistics[id].mastery < learningInProgressMasteryMin,
      );

      sessionSubjects.push(
        ...prioritizeSubjects(
          subjectStatistics,
          newSubjects,
          this.idTaskMapping,
        ).slice(0, count - sessionSubjects.length),
      );
    }

    return sessionSubjects.map((id) => this.idTaskMapping[id]);
  }

  recordResults(results: Record<string, number>, time: number = getToday()) {
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
    const subjectStatistics = this.getSubjectStatisticsAt(getToday());
    return Object.fromEntries(
      this.subjects.map((id) => [id, subjectStatistics[id].lastCorrectness]),
    );
  }

  get mastery(): Record<string, number> {
    const subjectStatistics = this.getSubjectStatisticsAt(getToday());
    return Object.fromEntries(
      this.subjects.map((id) => [id, subjectStatistics[id].mastery]),
    );
  }

  get lastRepetition(): Record<string, number | undefined> {
    const subjectStatistics = this.getSubjectStatisticsAt(getToday());
    return Object.fromEntries(
      this.subjects.map((id) => [id, subjectStatistics[id].lastRepetition]),
    );
  }

  get lastMastery(): Record<string, number> {
    const subjectStatistics = this.getSubjectStatisticsAt(getToday());
    return Object.fromEntries(
      this.subjects.map((id) => [id, subjectStatistics[id].lastMastery]),
    );
  }

  get subjectStatistics() {
    return this.getSubjectStatisticsAt(getToday());
  }

  getSaveData(): SaveData {
    return this.results;
  }

  restoreFromSaveData(saveData: SaveData) {
    this.results = saveData;
  }
}
