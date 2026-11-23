import { getMastery } from './getMastery';

export const getMasteries = (
  results: { id: string; day: number; correctness: number }[],
  today: number,
) => {
  const ids = Array.from(new Set(results.map((result) => result.id)));

  const resultsBeforeDays = results.map((result) => ({
    ...result,
    beforeDays: today - result.day,
  }));

  return Object.fromEntries(
    ids.map((id) => [
      id,
      getMastery(resultsBeforeDays.filter((result) => result.id === id)),
    ]),
  );
};
