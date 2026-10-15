import { getMasteries } from './learnScheduler.utils/getMasteries';
import { prioritizeSubjects } from './learnScheduler.utils/prioritizeSubjects';
import {
  learningInProgressMasteryMax,
  learningInProgressMasteryMin,
  repeatSubjectsMasteryMax,
} from './learnScheduler.constants';
import { SaveData, LearnSubject, TimedResult } from '../model';
import { getToday } from '../utils';

export class LearnScheduler<S extends LearnSubject = LearnSubject> {
  private results: TimedResult[] = [];
  private idSubjectMapping: Record<string, S>;

  private get subjects() {
    return Object.values(this.idSubjectMapping);
  }

  private get subjectIds() {
    return this.subjects.map((subject) => subject.id);
  }

  constructor(subjects: S[]) {
    this.idSubjectMapping = Object.fromEntries(
      subjects.map((subject) => [subject.id, subject] as const),
    );
  }

  public nextSession(count: number, time: number = getToday()): S[] {
    if (count <= 0) {
      return [];
    }

    const subjectStatistics = this.getSubjectStatisticsAt(time);

    const learningInProgressSubjects = this.subjectIds.filter((id) => {
      const { mastery, lastMastery } = subjectStatistics[id];
      return (
        mastery > learningInProgressMasteryMin &&
        mastery < learningInProgressMasteryMax &&
        lastMastery < learningInProgressMasteryMax
      );
    });

    const repeatSubjects = this.subjectIds.filter((id) => {
      const { mastery, lastMastery } = subjectStatistics[id];
      return (
        lastMastery > learningInProgressMasteryMax &&
        mastery < repeatSubjectsMasteryMax
      );
    });

    const repeatWrongSubjects = this.subjectIds.filter((id) => {
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
        (subject) =>
          subjectStatistics[subject.id].mastery < learningInProgressMasteryMin,
      );

      sessionSubjects.push(
        ...prioritizeSubjects(subjectStatistics, newSubjects).slice(
          0,
          count - sessionSubjects.length,
        ),
      );
    }

    return sessionSubjects.map((id) => this.idSubjectMapping[id]);
  }

  public recordResults(
    results: Record<string, number>,
    time: number = getToday(),
  ) {
    for (const [id, correctness] of Object.entries(results)) {
      if (!this.subjectIds.includes(id)) {
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

  public getSaveData(): SaveData {
    return this.results;
  }

  public restoreFromSaveData(saveData: SaveData) {
    this.results = saveData;
  }

  public get lastCorrectness(): Record<string, number> {
    const subjectStatistics = this.getSubjectStatisticsAt(getToday());
    return Object.fromEntries(
      this.subjectIds.map((id) => [id, subjectStatistics[id].lastCorrectness]),
    );
  }

  public get mastery(): Record<string, number> {
    const subjectStatistics = this.getSubjectStatisticsAt(getToday());
    return Object.fromEntries(
      this.subjectIds.map((id) => [id, subjectStatistics[id].mastery]),
    );
  }

  public get lastRepetition(): Record<string, number | undefined> {
    const subjectStatistics = this.getSubjectStatisticsAt(getToday());
    return Object.fromEntries(
      this.subjectIds.map((id) => [id, subjectStatistics[id].lastRepetition]),
    );
  }

  public get lastMastery(): Record<string, number> {
    const subjectStatistics = this.getSubjectStatisticsAt(getToday());
    return Object.fromEntries(
      this.subjectIds.map((id) => [id, subjectStatistics[id].lastMastery]),
    );
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
      Array.from(new Set(this.subjectIds)).map((id) => {
        const relevantResults = this.results
          .filter(
            (result) =>
              this.idSubjectMapping[result.id].parentIds?.includes(id) &&
              result.time <= time,
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
}
