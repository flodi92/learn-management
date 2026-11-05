import { learningStates } from '../../../model';
import {
  OverviewAggregatedStatisticsItem,
  OverviewSubjectStatisticsItem,
  OverviewStatistics,
  SelectionState,
} from '../../../overview/overview.model';
import {
  learningStateColors,
  selectedColor,
  selectionHighlightColor,
  selectionStateIndicators,
  unfocusedSelectionColor,
} from '../console.constants';

const summarizedSubjectKeys = new Set<string>([
  'id',
  'label',
  'mastery',
  'lastRepetitionBeforeDays',
  'numberOfRepetitions',
  'learningState',
]);

// "forRepeat" -> "for repeat"
export const camelCaseToWords = (text: string): string =>
  text.replace(/([a-z\d])([A-Z])/g, '$1 $2').toLowerCase();

export const isOverviewSubjectStatisticsItem = (
  statistics: OverviewStatistics,
): statistics is OverviewSubjectStatisticsItem => 'learningState' in statistics;

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
  const average = Number.isFinite(statistics.avgLastRepetitionBeforeDays)
    ? `⌀ ${statistics.avgLastRepetitionBeforeDays} days before`
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

const formatSubjectStatistics = (
  statistics: OverviewSubjectStatisticsItem,
  isFocused: boolean,
): string => {
  const color = learningStateColors[statistics.learningState];
  const mastery = `${Math.round(statistics.mastery * 100)}%`;
  if (!isFocused) return color(mastery);

  const repetitions = Number.isFinite(statistics.lastRepetitionBeforeDays)
    ? `${statistics.numberOfRepetitions}x ${statistics.lastRepetitionBeforeDays} days before`
    : `${statistics.numberOfRepetitions}x`;
  const summary = [
    color(`${camelCaseToWords(statistics.learningState)} (${mastery})`),
    repetitions,
  ].join(' ');
  const otherValues = Object.entries(statistics)
    .filter(([key]) => !summarizedSubjectKeys.has(key))
    .map(([key, value]) => formatLabeledValue(key, value));
  return [summary, ...otherValues].join(', ');
};

export const formatStatistics = (
  statistics: OverviewStatistics,
  isFocused: boolean,
): string =>
  isOverviewSubjectStatisticsItem(statistics)
    ? formatSubjectStatistics(statistics, isFocused)
    : formatAggregatedStatistics(statistics, isFocused);
