import { TimedResult } from '../../model';
import { convertTimestampToDay } from '../../utils';
import {
  dropOutRecallProbability,
  failedRecallProbability,
  failureFactor,
  initialStabilityDays,
  learningTargetRecallProbability,
  learntStabilityDays,
  learntTargetRecallProbability,
  maxStabilityDays,
  minStabilityDays,
  spacingFloor,
  stabilityGain,
} from '../learnScheduler.constants';
import { LearnSchedulerStatisticsItem } from '../learnScheduler.model';

export const getMastery = (
  repetitions: TimedResult[],
  timestamp: number,
): LearnSchedulerStatisticsItem => {
  let stability = initialStabilityDays;
  let lastRepetition: number | undefined;
  let lastCorrectness: number | undefined;
  let lastMastery: number | undefined;
  let isLearnt = false;

  for (const repetition of repetitions) {
    const before =
      lastRepetition === undefined || lastMastery === undefined
        ? 1
        : lastMastery *
          2 **
            (-convertTimestampToDay(repetition.timestamp - lastRepetition) /
              stability);
    const spacing = 1 - before;
    const growth =
      lastRepetition !== undefined &&
      Math.floor(convertTimestampToDay(lastRepetition)) ===
        Math.floor(convertTimestampToDay(repetition.timestamp))
        ? 1
        : 1 + stabilityGain * (spacingFloor + (1 - spacingFloor) * spacing);
    const factor =
      growth ** repetition.correctness *
      failureFactor ** (1 - repetition.correctness);
    stability = Math.max(
      minStabilityDays,
      Math.min(maxStabilityDays, stability * factor),
    );
    isLearnt ||= stability >= learntStabilityDays;
    lastRepetition = repetition.timestamp;
    lastCorrectness = repetition.correctness;
    lastMastery =
      failedRecallProbability +
      (1 - failedRecallProbability) * repetition.correctness;
  }

  const mastery =
    lastRepetition === undefined || lastMastery === undefined
      ? 0
      : lastMastery *
        2 ** (-convertTimestampToDay(timestamp - lastRepetition) / stability);
  const learningState =
    lastRepetition === undefined ||
    (!isLearnt && mastery < dropOutRecallProbability)
      ? 'notLearned'
      : !isLearnt
        ? 'learning'
        : mastery < learntTargetRecallProbability
          ? 'forRepeat'
          : 'learned';
  const isDue =
    learningState !== 'notLearned' &&
    mastery <
      (isLearnt
        ? learntTargetRecallProbability
        : learningTargetRecallProbability);

  return {
    mastery,
    lastRepetition,
    lastMastery,
    lastCorrectness,
    numberOfRepetitions: repetitions.length,
    stability: lastRepetition === undefined ? undefined : stability,
    isLearnt,
    isDue,
    learningState,
  };
};
