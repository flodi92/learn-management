import { learningStates } from '../../../model';
import {
  OverviewAggregatedStatisticsItem,
  OverviewExamination,
  OverviewStatistics,
  OverviewTaskDescriptionStatisticsItem,
  SelectionState,
} from '../../../overview/overview.model';
import { convertMillisecondsToHumanReadable } from '../../../utils';
import {
  correctExaminationColor,
  correctExaminationThreshold,
  incorrectExaminationColor,
  learningStateColors,
  selectedColor,
  selectionHighlightColor,
  selectionStateIndicators,
  unfocusedSelectionColor,
} from '../console.constants';

const summarizedTaskDescriptionKeys = new Set<string>([
  'id',
  'label',
  'mastery',
  'lastRepetitionBefore',
  'numberOfRepetitions',
  'learningState',
  'examinations',
]);

// "forRepeat" -> "for repeat"
export const camelCaseToWords = (text: string): string =>
  text.replace(/([a-z\d])([A-Z])/g, '$1 $2').toLowerCase();

export const isOverviewTaskDescriptionStatisticsItem = (
  statistics: OverviewStatistics,
): statistics is OverviewTaskDescriptionStatisticsItem =>
  'learningState' in statistics;

const formatLabeledValue = (
  key: string,
  value: unknown,
  color?: (text: string) => string,
) => {
  const text = String(value);
  return `${camelCaseToWords(key)}: ${color ? color(text) : text}`;
};

const neverTrained = 'never trained';

const formatSelectionState = (
  selectionState: SelectionState,
  isFocused: boolean,
): string => {
  const { text, isHighlighted } = selectionStateIndicators[selectionState];
  const highlighted = isHighlighted ? selectionHighlightColor(text) : text;
  return isFocused ? highlighted : unfocusedSelectionColor(highlighted);
};

const formatAggregatedStatistics = (
  statistics: OverviewAggregatedStatisticsItem,
  isFocused: boolean,
): string => {
  const counts = learningStates.map((state) =>
    isFocused
      ? formatLabeledValue(state, statistics[state], learningStateColors[state])
      : learningStateColors[state](String(statistics[state])),
  );
  const average = Number.isFinite(statistics.avgLastRepetitionBefore)
    ? `⌀ ${convertMillisecondsToHumanReadable(statistics.avgLastRepetitionBefore)} before`
    : neverTrained;
  const separator = isFocused ? ', ' : ' ';
  const selected = selectedColor(String(statistics.selected));
  const formatted = [
    isFocused ? `${selectedColor('selected: ')}${selected}` : selected,
    ...counts,
    average,
  ].join(separator);
  return `${formatSelectionState(statistics.selectionState, isFocused)} ${formatted}`;
};

const formatTaskDescriptionStatistics = (
  statistics: OverviewTaskDescriptionStatisticsItem,
  isFocused: boolean,
): string => {
  const color = learningStateColors[statistics.learningState];
  const mastery = `${Math.round(statistics.mastery * 100)}%`;
  if (!isFocused) return color(mastery);

  const repetitions = Number.isFinite(statistics.lastRepetitionBefore)
    ? `${statistics.numberOfRepetitions}x ${convertMillisecondsToHumanReadable(statistics.lastRepetitionBefore)} before`
    : `${statistics.numberOfRepetitions}x`;
  const summary = [
    color(`${camelCaseToWords(statistics.learningState)} (${mastery})`),
    repetitions,
  ].join(' ');
  const otherValues = Object.entries(statistics)
    .filter(([key]) => !summarizedTaskDescriptionKeys.has(key))
    .map(([key, value]) => formatLabeledValue(key, value));
  return [summary, ...otherValues].join(', ');
};

export const formatStatistics = (
  statistics: OverviewStatistics,
  isFocused: boolean,
): string =>
  isOverviewTaskDescriptionStatisticsItem(statistics)
    ? formatTaskDescriptionStatistics(statistics, isFocused)
    : formatAggregatedStatistics(statistics, isFocused);

const formatExamination = ({
  examinedBefore,
  correctness,
  wasConfusedWith,
}: OverviewExamination): string => {
  const isCorrect = correctness >= correctExaminationThreshold;
  const confusion =
    wasConfusedWith.length > 0
      ? `, was confused with ${wasConfusedWith.join(', ')}`
      : '';
  const color = isCorrect ? correctExaminationColor : incorrectExaminationColor;
  return color(
    `${convertMillisecondsToHumanReadable(examinedBefore)} before: ${isCorrect ? 'correct' : 'incorrect'}${confusion}`,
  );
};

// One line per examination of a taskDescription, aggregated statistics have no details.
export const formatStatisticsDetails = (
  statistics: OverviewStatistics,
): string[] =>
  isOverviewTaskDescriptionStatisticsItem(statistics)
    ? statistics.examinations.map(formatExamination)
    : [];
