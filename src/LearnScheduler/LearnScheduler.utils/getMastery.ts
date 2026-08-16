const converge0 = (a: number) => (val: number) => a / (val + a);
const converge1 = (a: number) => (val: number) => 1 - converge0(a)(val);

const forgetDays = converge0(10 /* days until half forgotten */);
const keepDays = converge1(10);

const keepRepetitions = converge1(3);
export interface Result {
  beforeDays: number;
  correctness: number; /* [0, 1] */
}

const sqrtKeepSign = (val: number) => Math.sign(val) * Math.sqrt(Math.abs(val));

export const getMastery = (results: Result[]) => {
  results.forEach((result) => {
    if (result.correctness < 0 || result.correctness > 1) {
      {
        throw new Error(
          `correctness of result ${JSON.stringify(result)} should be in range between 0 and 1 inclusive`,
        );
      }
    }
  });

  const summedRepetitionsMasteries = results
    .sort((a, b) => a.beforeDays - b.beforeDays)
    .map(({ beforeDays, correctness }, idx, arr) => {
      const nextEarlier = arr[idx + 1];
      const factor1 = 0.5;
      const factor2 = 1 - factor1;
      const keptOverTimeOfThisRepetition =
        factor1 * Math.sqrt(forgetDays(beforeDays) * correctness);

      if (!nextEarlier) {
        return keptOverTimeOfThisRepetition;
        // return 0;
      }

      const rewardForKeepingBetweenRepetitions =
        factor2 *
        sqrtKeepSign(
          keepDays(nextEarlier.beforeDays - beforeDays) *
            (0.5 * nextEarlier.correctness + 1.5 * correctness - 1),
        );

      return sqrtKeepSign(
        keptOverTimeOfThisRepetition + rewardForKeepingBetweenRepetitions,
      );
    })
    .map((current) => {
      if (current < -1 || current > 1) {
        throw new Error('value for repetition should be in range -1 to 1');
      }
      return current;
    });

  // console.log(summedRepetitionsMasteries);

  const summedRepetitionsMastery = summedRepetitionsMasteries.reduce(
    (sum, current) => sum + current,
    0,
  );

  return keepRepetitions(Math.max(summedRepetitionsMastery, 0));
};

export const getMastery2 = (results: Result[]) => {
  results.forEach((result) => {
    if (result.correctness < 0 || result.correctness > 1) {
      {
        throw new Error(
          `correctness of result ${JSON.stringify(result)} should be in range between 0 and 1 inclusive`,
        );
      }
    }
  });

  if (results.length === 0) {
    return 0;
  }

  const halfLifeDays = 27.721718649386354;
  const recencyWeight = 1.2693389675763158;
  const stabilityWeight = 2.282981241592603;
  const riseWeight = -3.066836700430141;
  const fallWeight = -0.5788090465306972;
  const minimumLevelWeight = 3.9017949569627817;
  const sustainedPersistenceWeight = 0.0839539284122921;
  const sustainedMasteryWeight = -3.896755705678922;
  const deltaWeight = -0.23891157541162933;
  const latestRepetitionWeight = -0.25833969850516336;
  const spanWeight = -0.08323265171600625;

  const sorted = [...results].sort((a, b) => a.beforeDays - b.beforeDays);
  const lastIndex = sorted.length - 1;
  let total = 0;

  for (let i = 0; i < sorted.length; i += 1) {
    const current = sorted[i];
    const previous = sorted[i - 1];

    total +=
      recencyWeight *
      current.correctness *
      Math.exp(-current.beforeDays / halfLifeDays);

    if (previous) {
      const gapDays = current.beforeDays - previous.beforeDays;
      const interval = 1 - Math.exp(-gapDays / halfLifeDays);
      const mean = (current.correctness + previous.correctness) / 2;
      const rise = Math.max(0, current.correctness - previous.correctness);
      const fall = Math.max(0, previous.correctness - current.correctness);
      const minimumLevel = Math.min(current.correctness, previous.correctness);
      const shouldPersist =
        current.correctness >= previous.correctness ? 1 : -1;
      const sustainedMastery = current.correctness * 2 - previous.correctness;
      const delta = current.correctness - previous.correctness;

      total += stabilityWeight * interval * mean;
      total += riseWeight * interval * rise;
      total += fallWeight * interval * fall;
      total += minimumLevelWeight * interval * minimumLevel;
      total += sustainedPersistenceWeight * interval * shouldPersist;
      total += sustainedMasteryWeight * interval * sustainedMastery;
      total += deltaWeight * interval * delta;
    }

    total +=
      latestRepetitionWeight *
      current.correctness *
      (i === lastIndex ? 1 : 0.5);
  }

  const spanDays =
    sorted.length > 1 ? sorted[lastIndex].beforeDays - sorted[0].beforeDays : 0;

  total += spanWeight * spanDays * 0.01;

  const normalized = total / (sorted.length + 1);
  return Math.max(0, Math.min(1, normalized));
};
