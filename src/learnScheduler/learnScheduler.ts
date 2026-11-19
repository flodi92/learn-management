import { SaveData, TaskDescription, TimedResult } from '../model';
import { getToday } from '../utils';
import { assembleNextSession } from './learnScheduler.utils/assembleNextSession';
import { computeTaskDescriptionStatisticsAt } from './learnScheduler.utils/computeTaskDescriptionStatisticsAt';

export class LearnScheduler<TD extends TaskDescription = TaskDescription> {
  private _results: TimedResult[] = [];
  private _idTaskDescriptionMapping: Record<string, TD>;

  constructor(taskDescriptions: TD[]) {
    this._idTaskDescriptionMapping = Object.fromEntries(
      taskDescriptions.map(
        (taskDescription) => [taskDescription.id, taskDescription] as const,
      ),
    );
  }

  public nextSession(count: number, day: number = getToday()): TD[] {
    return assembleNextSession({
      count,
      day,
      idTaskDescriptionMapping: this._idTaskDescriptionMapping,
      results: this._results,
    });
  }

  public recordResults(
    results: Record<string, number>,
    day: number = getToday(),
  ) {
    for (const [id, correctness] of Object.entries(results)) {
      if (!this.taskDescriptionIds.includes(id)) {
        continue;
      }

      if (correctness < 0 || correctness > 1) {
        throw new Error(
          `correctness for taskDescription ${id} must be between 0 and 1 inclusive`,
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

  private get taskDescriptions() {
    return Object.values(this._idTaskDescriptionMapping);
  }

  private get taskDescriptionIds() {
    return this.taskDescriptions.map((taskDescription) => taskDescription.id);
  }

  public get lastCorrectness(): Record<string, number | undefined> {
    const taskDescriptionStatistics = computeTaskDescriptionStatisticsAt(
      getToday(),
      this._idTaskDescriptionMapping,
      this._results,
    );
    return Object.fromEntries(
      this.taskDescriptionIds.map((id) => [
        id,
        taskDescriptionStatistics[id].lastCorrectness,
      ]),
    );
  }

  public get mastery(): Record<string, number> {
    const taskDescriptionStatistics = computeTaskDescriptionStatisticsAt(
      getToday(),
      this._idTaskDescriptionMapping,
      this._results,
    );
    return Object.fromEntries(
      this.taskDescriptionIds.map((id) => [
        id,
        taskDescriptionStatistics[id].mastery,
      ]),
    );
  }

  public get lastRepetition(): Record<string, number | undefined> {
    const taskDescriptionStatistics = computeTaskDescriptionStatisticsAt(
      getToday(),
      this._idTaskDescriptionMapping,
      this._results,
    );
    return Object.fromEntries(
      this.taskDescriptionIds.map((id) => [
        id,
        taskDescriptionStatistics[id].lastRepetition,
      ]),
    );
  }

  public get lastMastery(): Record<string, number | undefined> {
    const taskDescriptionStatistics = computeTaskDescriptionStatisticsAt(
      getToday(),
      this._idTaskDescriptionMapping,
      this._results,
    );
    return Object.fromEntries(
      this.taskDescriptionIds.map((id) => [
        id,
        taskDescriptionStatistics[id].lastMastery,
      ]),
    );
  }

  public get results() {
    return this._results;
  }

  public get idTaskDescriptionMapping() {
    return this._idTaskDescriptionMapping;
  }
}
