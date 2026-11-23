import { LearningState, TaskDescriptionStatisticsItem } from '../../model';
import {
  learningInProgressMasteryMin,
  learningInProgressMasteryMax,
  repeatTaskDescriptionsMasteryMax,
} from '../learnScheduler.constants';

export const determineLearningStateFromStatisticsItem = ({
  mastery,
  lastMastery,
  lastRepetition,
  lastCorrectness,
}: TaskDescriptionStatisticsItem): LearningState => {
  if (mastery < learningInProgressMasteryMin) {
    return 'notLearned';
  }
  if (
    mastery >= learningInProgressMasteryMin &&
    mastery < learningInProgressMasteryMax &&
    (lastMastery ?? 0) < learningInProgressMasteryMax
  ) {
    return 'learning';
  }
  if (
    (lastMastery ?? 0) > learningInProgressMasteryMax &&
    mastery < repeatTaskDescriptionsMasteryMax
  ) {
    return 'forRepeat';
  }
  if (
    lastRepetition !== undefined &&
    lastCorrectness !== undefined &&
    lastCorrectness <= 0.5
  ) {
    return 'forRepeat';
  }

  return 'learned';
};
