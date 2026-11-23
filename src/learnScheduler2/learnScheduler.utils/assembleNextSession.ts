import { TaskDescription, TimedResult } from '../../model';
import { computeTaskDescriptionStatisticsAt } from './computeTaskDescriptionStatisticsAt';

interface AssembleNextSessionProps<TD extends TaskDescription> {
  count: number;
  day: number;
  idTaskDescriptionMapping: Record<string, TD>;
  results: TimedResult[];
}

export const assembleNextSession = <TD extends TaskDescription>({
  count,
  day,
  idTaskDescriptionMapping,
  results,
}: AssembleNextSessionProps<TD>): TD[] => {
  if (count <= 0) {
    return [];
  }

  const taskDescriptionStatistics = computeTaskDescriptionStatisticsAt(
    day,
    idTaskDescriptionMapping,
    results,
  );

  throw 'not implemented';
};
