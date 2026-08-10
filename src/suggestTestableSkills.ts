import { getConsciousness } from './getConsciousness';

const getBeforeDays = (date: Date) => undefined as unknown as number;

const containsAspectOtherAspect = (aspect: string, testParentAspect: string) =>
  testParentAspect.includes(aspect);

const prioritize = (
  results: { date: Date; aspect: string; correctness: number /* [0, 1] */ }[],
) => {
  const aspects = Array.from(new Set(results.map((result) => result.aspect)));
  const consciousnessOfAspects = aspects
    .map((aspect) => ({
      aspect,
      orderedResults: results
        .filter((result) => containsAspectOtherAspect(aspect, result.aspect))
        .map((result) => ({
          beforeDays: getBeforeDays(result.date),
          correctness: result.correctness,
        }))
        .sort((a, b) => a.beforeDays - b.beforeDays),
    }))
    .reduce(
      (acc, { aspect, orderedResults }) => ({
        ...acc,
        [aspect]: getConsciousness(orderedResults),
      }),
      {} as Record<string, number>,
    );

  return {
    1: Object.entries(consciousnessOfAspects).filter(
      ([_, consciousness]) => consciousness < 0.2,
    ),
    2: Object.entries(consciousnessOfAspects).filter(
      ([_, consciousness]) => consciousness >= 0.2 && consciousness < 0.5,
    ),
    3: Object.entries(consciousnessOfAspects).filter(
      ([_, consciousness]) => consciousness >= 0.5 && consciousness < 0.8,
    ),
    4: Object.entries(consciousnessOfAspects).filter(
      ([_, consciousness]) => consciousness > 0.8,
    ),
  };
};
