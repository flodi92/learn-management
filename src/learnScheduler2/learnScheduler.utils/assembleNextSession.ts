import { TaskDescription, TimedResult } from '../../model';
import {
  learningInProgressFraction,
  learningTargetRecallProbability,
  learntTargetRecallProbability,
  relatedLookAheadDays,
} from '../learnScheduler.constants';
import { LearnSchedulerCharacteristicsMapping } from '../learnScheduler.model';
import { computeTaskDescriptionStatisticsAt } from './computeTaskDescriptionStatisticsAt';
import {
  compareIds,
  compareOptionalNumbers,
  computeCharacteristics,
  getRelatedness,
  shareCategory,
} from './learnScheduler.utils';

interface AssembleNextSessionProps<TD extends TaskDescription> {
  count: number;
  day: number;
  idTaskDescriptionMapping: Record<string, TD>;
  results: TimedResult[];
  characteristics?: LearnSchedulerCharacteristicsMapping;
}

export const assembleNextSession = <TD extends TaskDescription>({
  count,
  day,
  idTaskDescriptionMapping,
  results,
  characteristics = computeCharacteristics(
    Object.values(idTaskDescriptionMapping),
  ),
}: AssembleNextSessionProps<TD>): TD[] => {
  const limit = Math.floor(count);
  if (limit <= 0) return [];

  const taskDescriptions = Object.values(idTaskDescriptionMapping);
  const statistics = computeTaskDescriptionStatisticsAt(
    day,
    idTaskDescriptionMapping,
    results,
  );
  const selected: TD[] = [];
  const selectedIds = new Set<string>();
  const available = (taskDescription: TD) => {
    const lastRepetition = statistics[taskDescription.id].lastRepetition;
    return (
      !selectedIds.has(taskDescription.id) &&
      (lastRepetition === undefined ||
        Math.floor(lastRepetition) !== Math.floor(day))
    );
  };
  const add = (taskDescription: TD) => {
    selected.push(taskDescription);
    selectedIds.add(taskDescription.id);
  };
  const compareCharacteristics = (a: TD, b: TD) =>
    compareOptionalNumbers(
      characteristics[a.id].effectiveRelevance,
      characteristics[b.id].effectiveRelevance,
    ) ||
    compareOptionalNumbers(
      characteristics[a.id].effectiveComplexity,
      characteristics[b.id].effectiveComplexity,
    );
  const preference = (taskDescription: TD) => {
    const minimum =
      characteristics[taskDescription.id].minimumCategoryRelevance;
    if (
      taskDescription.relevance !== undefined &&
      minimum !== undefined &&
      taskDescription.relevance > minimum
    ) {
      return 0;
    }
    return selected.reduce(
      (strength, other) =>
        Math.max(strength, getRelatedness(taskDescription, other)),
      0,
    );
  };
  const selectOrdered = (candidates: TD[]) => {
    for (const candidate of candidates) {
      if (selected.length >= limit) break;
      add(candidate);
    }
  };

  selectOrdered(
    taskDescriptions
      .filter(
        (taskDescription) =>
          available(taskDescription) &&
          statistics[taskDescription.id].learningState === 'learning' &&
          statistics[taskDescription.id].isDue,
      )
      .sort(
        (a, b) =>
          statistics[a.id].mastery - statistics[b.id].mastery ||
          compareCharacteristics(a, b) ||
          compareIds(a.id, b.id),
      ),
  );
  selectOrdered(
    taskDescriptions
      .filter(
        (taskDescription) =>
          available(taskDescription) &&
          statistics[taskDescription.id].learningState === 'forRepeat',
      )
      .sort(
        (a, b) =>
          statistics[a.id].mastery - statistics[b.id].mastery ||
          compareIds(a.id, b.id),
      ),
  );

  let room =
    Math.max(1, Math.ceil(learningInProgressFraction * count)) -
    taskDescriptions.filter(
      (taskDescription) =>
        statistics[taskDescription.id].learningState === 'learning',
    ).length;
  const introductions = taskDescriptions.filter((candidate) => {
    if (
      !available(candidate) ||
      statistics[candidate.id].learningState !== 'notLearned'
    ) {
      return false;
    }
    const { effectiveRelevance, effectiveComplexity, prerequisiteIds } =
      characteristics[candidate.id];
    if (prerequisiteIds.some((id) => !statistics[id].isLearnt)) return false;
    return taskDescriptions.every((other) => {
      if (statistics[other.id].isLearnt) return true;
      const otherCharacteristics = characteristics[other.id];
      if (
        effectiveRelevance !== undefined &&
        otherCharacteristics.effectiveRelevance !== undefined &&
        otherCharacteristics.effectiveRelevance < effectiveRelevance
      ) {
        return false;
      }
      return !(
        effectiveRelevance !== undefined &&
        effectiveComplexity !== undefined &&
        otherCharacteristics.effectiveRelevance === effectiveRelevance &&
        otherCharacteristics.effectiveComplexity !== undefined &&
        otherCharacteristics.effectiveComplexity < effectiveComplexity &&
        shareCategory(candidate, other)
      );
    });
  });
  while (selected.length < limit && room > 0 && introductions.length > 0) {
    introductions.sort(
      (a, b) =>
        compareCharacteristics(a, b) ||
        preference(b) - preference(a) ||
        compareIds(a.id, b.id),
    );
    const candidate = introductions.shift();
    if (candidate === undefined) break;
    add(candidate);
    room--;
  }

  const nearlyDue = (taskDescription: TD) => {
    const item = statistics[taskDescription.id];
    if (item.stability === undefined) return false;
    const target = item.isLearnt
      ? learntTargetRecallProbability
      : learningTargetRecallProbability;
    return (
      item.mastery * 2 ** (-relatedLookAheadDays / item.stability) < target
    );
  };
  const fill = taskDescriptions.filter(
    (taskDescription) =>
      available(taskDescription) &&
      (statistics[taskDescription.id].learningState === 'learning' ||
        statistics[taskDescription.id].learningState === 'learned'),
  );
  while (selected.length < limit && fill.length > 0) {
    fill.sort(
      (a, b) =>
        preference(b) - preference(a) ||
        Number(nearlyDue(b)) - Number(nearlyDue(a)) ||
        statistics[a.id].mastery - statistics[b.id].mastery ||
        compareIds(a.id, b.id),
    );
    const candidate = fill.shift();
    if (candidate === undefined) break;
    add(candidate);
  }
  return selected;
};
