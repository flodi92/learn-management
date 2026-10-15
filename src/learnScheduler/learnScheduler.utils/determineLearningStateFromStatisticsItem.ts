import { SubjectStatisticsItem, LearningState } from '../../model';
import {
  learningInProgressMasteryMin,
  learningInProgressMasteryMax,
  repeatSubjectsMasteryMax,
} from '../learnScheduler.constants';

export const determineLearningStateFromStatisticsItem = ({
  mastery,
  lastMastery,
  lastRepetition,
  lastCorrectness,
}: SubjectStatisticsItem): LearningState => {
  if (mastery < learningInProgressMasteryMin) {
    return 'notLearned';
  }
  if (
    mastery >= learningInProgressMasteryMin &&
    mastery < learningInProgressMasteryMax &&
    lastMastery < learningInProgressMasteryMax
  ) {
    return 'learning';
  }
  if (
    lastMastery > learningInProgressMasteryMax &&
    mastery < repeatSubjectsMasteryMax
  ) {
    return 'forRepeat';
  }
  if (lastRepetition !== undefined && lastCorrectness <= 0.5) {
    return 'forRepeat';
  }

  return 'learned';
};
