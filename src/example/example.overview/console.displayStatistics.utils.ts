import { learningStates } from '../../model';
import {
  OverviewAggregatedStatisticsItem,
  OverviewRecursiveStatistics,
  OverviewSubjectStatisticsItem,
  OverviewStatistics,
} from '../../overview/overview.model';
import { learningStateColors, statisticsLabelColor } from './console.constants';

// Keys of OverviewSubjectStatisticsItem that are not shown as "other values"
const summarizedSubjectKeys = new Set<string>([
  'label',
  'mastery',
  'lastRepetitionBeforeDays',
  'numberOfRepetitions',
  'learningState',
]);

export const indentation = (depth: number) => '  '.repeat(depth);

export const pathId = (path: string[]) => JSON.stringify(path);

const getLabel = (statistics: object): string | undefined => {
  const label = (statistics as { label?: unknown }).label;
  return typeof label === 'string' && label !== '' ? label : undefined;
};

export const getDisplayName = (
  node: OverviewRecursiveStatistics,
  id: string,
): string => getLabel(node.statistics) ?? id;

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
  return `${statisticsLabelColor(`${camelCaseToWords(key)}:`)} ${color ? color(text) : text}`;
};

export const formatAggregatedStatistics = (
  statistics: OverviewAggregatedStatisticsItem,
  isFocused: boolean,
): string => {
  const average = `⌀ ${statistics.avgLastRepetitionBeforeDays} days before `;
  const counts = learningStates.map((state) =>
    isFocused
      ? formatLabeledValue(state, statistics[state], learningStateColors[state])
      : learningStateColors[state](String(statistics[state])),
  );
  return average + counts.join(isFocused ? ', ' : ' ');
};

export const formatSubjectStatistics = (
  statistics: OverviewSubjectStatisticsItem,
  isFocused: boolean,
): string => {
  const color = learningStateColors[statistics.learningState];
  const summary = [
    color(
      `${camelCaseToWords(statistics.learningState)} (${Math.round(statistics.mastery * 100)}%)`,
    ),
    `${statistics.numberOfRepetitions}x ${statistics.lastRepetitionBeforeDays} days before`,
  ].join(' ');
  if (!isFocused) return summary;

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

export const getChildren = (
  node: OverviewRecursiveStatistics,
):
  | { childType: string; entries: [string, OverviewRecursiveStatistics][] }
  | undefined =>
  node.children !== undefined && node.childType !== undefined
    ? { childType: node.childType, entries: Object.entries(node.children) }
    : undefined;
