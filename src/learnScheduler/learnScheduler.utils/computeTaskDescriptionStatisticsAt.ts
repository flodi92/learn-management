import { TaskDescription, TimedResult } from '../../model';
import { LearnSchedulerStatistics } from '../learnScheduler.model';
import { getMastery } from './getMastery';

export const computeTaskDescriptionStatisticsAt = (
  day: number,
  idTaskDescriptionMapping: Record<string, TaskDescription>,
  results: TimedResult[],
): LearnSchedulerStatistics => {
  const repetitions = new Map(
    Object.keys(idTaskDescriptionMapping).map((id) => [
      id,
      [] as TimedResult[],
    ]),
  );
  const orderedResults = results
    .filter((result) => result.day <= day)
    .slice()
    .sort((a, b) => a.day - b.day);

  for (const result of orderedResults) {
    const visited = new Set<string>();
    const pending = [result.id];
    while (pending.length > 0) {
      const id = pending.pop();
      if (id === undefined || visited.has(id)) continue;
      visited.add(id);
      const taskDescription = idTaskDescriptionMapping[id];
      if (!taskDescription) continue;
      repetitions.get(id)?.push(result);
      pending.push(...(taskDescription.parents ?? []));
    }
  }

  return Object.fromEntries(
    Array.from(repetitions, ([id, taskRepetitions]) => [
      id,
      getMastery(taskRepetitions, day),
    ]),
  );
};
