import { Result, SaveData, TaskDescription, TimedResult } from '../model';
import { assembleNextSession } from './learnScheduler.utils/assembleNextSession';
import { computeTaskDescriptionStatisticsAt } from './learnScheduler.utils/computeTaskDescriptionStatisticsAt';
import { computeCharacteristics } from './learnScheduler.utils/learnScheduler.utils';

export class LearnScheduler<TD extends TaskDescription = TaskDescription> {
  private _results: TimedResult[] = [];
  private _idTaskDescriptionMapping: Record<string, TD>;
  private _characteristics;

  constructor(taskDescriptions: TD[]) {
    this._idTaskDescriptionMapping = Object.fromEntries(
      taskDescriptions.map(
        (taskDescription) => [taskDescription.id, taskDescription] as const,
      ),
    );
    this._characteristics = computeCharacteristics(this.taskDescriptions);
  }

  public nextSession(count: number, timestamp: number = Date.now()): TD[] {
    return assembleNextSession({
      count,
      timestamp,
      idTaskDescriptionMapping: this._idTaskDescriptionMapping,
      results: this._results,
      characteristics: this._characteristics,
    });
  }

  public recordResult(result: Result, timestamp: number = Date.now()) {
    const { id, correctness } = result;
    if (!this.taskDescriptionIds.includes(id)) {
      return;
    }

    if (correctness < 0 || correctness > 1) {
      throw new Error(
        `correctness for taskDescription ${id} must be between 0 and 1 inclusive`,
      );
    }

    this._results.push({ ...result, timestamp });
  }

  public recordResults(
    results: Record<string, number>,
    timestamp: number = Date.now(),
  ) {
    for (const [id, correctness] of Object.entries(results)) {
      this.recordResult({ id, correctness }, timestamp);
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
      Date.now(),
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
      Date.now(),
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
      Date.now(),
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
      Date.now(),
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
