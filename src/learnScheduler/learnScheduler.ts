import { LearnSubject, SaveData, TimedResult } from '../model';
import { getToday } from '../utils';
import { assembleNextSession } from './learnScheduler.utils/assembleNextSession';
import { computeSubjectStatisticsAt } from './learnScheduler.utils/computeSubjectStatisticsAt';

export class LearnScheduler<S extends LearnSubject = LearnSubject> {
  private _results: TimedResult[] = [];
  private _idSubjectMapping: Record<string, S>;

  constructor(subjects: S[]) {
    this._idSubjectMapping = Object.fromEntries(
      subjects.map((subject) => [subject.id, subject] as const),
    );
  }

  public nextSession(count: number, day: number = getToday()): S[] {
    return assembleNextSession({
      count,
      day,
      idSubjectMapping: this._idSubjectMapping,
      results: this._results,
    });
  }

  public recordResults(
    results: Record<string, number>,
    day: number = getToday(),
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

      this._results.push({ id, day, correctness });
    }
  }

  public getSaveData(): SaveData {
    return this._results;
  }

  public restoreFromSaveData(saveData: SaveData) {
    this._results = saveData;
  }

  private get subjects() {
    return Object.values(this._idSubjectMapping);
  }

  private get subjectIds() {
    return this.subjects.map((subject) => subject.id);
  }

  public get lastCorrectness(): Record<string, number> {
    const subjectStatistics = computeSubjectStatisticsAt(
      getToday(),
      this._idSubjectMapping,
      this._results,
    );
    return Object.fromEntries(
      this.subjectIds.map((id) => [id, subjectStatistics[id].lastCorrectness]),
    );
  }

  public get mastery(): Record<string, number> {
    const subjectStatistics = computeSubjectStatisticsAt(
      getToday(),
      this._idSubjectMapping,
      this._results,
    );
    return Object.fromEntries(
      this.subjectIds.map((id) => [id, subjectStatistics[id].mastery]),
    );
  }

  public get lastRepetition(): Record<string, number | undefined> {
    const subjectStatistics = computeSubjectStatisticsAt(
      getToday(),
      this._idSubjectMapping,
      this._results,
    );
    return Object.fromEntries(
      this.subjectIds.map((id) => [id, subjectStatistics[id].lastRepetition]),
    );
  }

  public get lastMastery(): Record<string, number> {
    const subjectStatistics = computeSubjectStatisticsAt(
      getToday(),
      this._idSubjectMapping,
      this._results,
    );
    return Object.fromEntries(
      this.subjectIds.map((id) => [id, subjectStatistics[id].lastMastery]),
    );
  }

  public get results() {
    return this._results;
  }

  public get idSubjectMapping() {
    return this._idSubjectMapping;
  }
}
