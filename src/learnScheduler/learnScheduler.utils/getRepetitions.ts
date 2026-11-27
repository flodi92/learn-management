import { TaskDescription, TimedResult } from '../../model';

// The repetitions of a taskDescription are ordered by day and include the results of all taskDescriptions it is a parent of.
export const getRepetitions = (
  day: number,
  idTaskDescriptionMapping: Record<string, TaskDescription>,
  results: TimedResult[],
): Map<string, TimedResult[]> => {
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

  return repetitions;
};
