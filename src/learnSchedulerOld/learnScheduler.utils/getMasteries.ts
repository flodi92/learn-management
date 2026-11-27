import { convertTimestampToDay } from '../../utils';
import { getMastery } from './getMastery';

export const getMasteries = (
  results: { id: string; timestamp: number; correctness: number }[],
  timestamp: number,
) => {
  const ids = Array.from(new Set(results.map((result) => result.id)));

  const resultsBeforeDays = results.map((result) => ({
    ...result,
    beforeDays: convertTimestampToDay(timestamp - result.timestamp),
  }));

  return Object.fromEntries(
    ids.map((id) => [
      id,
      getMastery(resultsBeforeDays.filter((result) => result.id === id)),
    ]),
  );
};
