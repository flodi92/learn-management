import { getConsciousness } from './getConsciousness';

export const getConsciousnesses = (
  results: { id: string; time: number; correctness: number }[],
  today: number,
) => {
  const ids = Array.from(new Set(results.map((result) => result.id)));

  const resultsBeforeDays = results.map((result) => ({
    ...result,
    beforeDays: today - result.time,
  }));

  return Object.fromEntries(
    ids.map((id) => [
      id,
      getConsciousness(resultsBeforeDays.filter((result) => result.id === id)),
    ]),
  );
};
