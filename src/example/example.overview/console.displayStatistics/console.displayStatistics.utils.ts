import {
  OverviewGroupTypeOrTaskDescription,
  OverviewSelectionPath,
} from '../../../overview/overview.model';
import { OverviewRecursiveUndeterminedStatistics } from '../../../overview/overview.utils/overview.computeStatistics.model';
import { Focus, Line, StatisticsPath } from './console.displayStatistics.model';

type Node<Statistics extends object> = OverviewRecursiveUndeterminedStatistics<
  Statistics,
  OverviewGroupTypeOrTaskDescription
>;

export const indentation = (depth: number) => '  '.repeat(depth);

export const pathId = (path: StatisticsPath) => JSON.stringify(path);

export const focusId = (focus: Focus) =>
  JSON.stringify([focus.isHeading, focus.path]);

export const getLineFocus = <Statistics extends object>(
  line: Line<Statistics>,
): Focus | undefined =>
  line.path
    ? { path: line.path, isHeading: false }
    : line.headingOf
      ? { path: line.headingOf, isHeading: true }
      : undefined;

const startsWith = (path: StatisticsPath, prefix: StatisticsPath) =>
  prefix.every(
    ([groupType, key], index) =>
      path[index]?.[0] === groupType && path[index][1] === key,
  );

export const isHighlighted = <Statistics extends object>(
  line: Line<Statistics>,
  focus: Focus,
): boolean => {
  if (line.hiddenChildrenOf) return false;
  if (line.path) return startsWith(focus.path, line.path);
  if (line.headingOf) {
    return (
      startsWith(focus.path, line.headingOf) &&
      (focus.path.length > line.headingOf.length || focus.isHeading)
    );
  }
  return startsWith(focus.path, line.nodePath);
};

const getLabel = (statistics: object): string | undefined => {
  const label = (statistics as { label?: unknown }).label;
  return typeof label === 'string' && label !== '' ? label : undefined;
};

export const getDisplayName = <Statistics extends object>(
  node: Node<Statistics>,
  id: string | number,
): string => getLabel(node.statistics) ?? String(id);

export const getNode = <Statistics extends object>(
  root: Node<Statistics>,
  path: StatisticsPath,
): Node<Statistics> | undefined =>
  path.reduce<Node<Statistics> | undefined>(
    (node, [groupType, key]) => node?.getChildren(groupType)?.[key],
    root,
  );

// The defaultGroupType is not necessarily part of possibleGroupTypes (e.g. 'taskDescription'), but must always be selectable.
export const getSelectableGroupTypes = <Statistics extends object>(
  node: Node<Statistics>,
): OverviewGroupTypeOrTaskDescription[] => {
  const possibleGroupTypes = node.possibleGroupTypes ?? [];
  const { defaultGroupType } = node;
  return defaultGroupType === undefined ||
    possibleGroupTypes.includes(defaultGroupType)
    ? possibleGroupTypes
    : [defaultGroupType, ...possibleGroupTypes];
};

export const getNextGroupType = (
  groupTypes: OverviewGroupTypeOrTaskDescription[],
  current: OverviewGroupTypeOrTaskDescription,
  delta: number,
) =>
  groupTypes[
    (groupTypes.indexOf(current) + delta + groupTypes.length) %
      groupTypes.length
  ];

export const getSortedChildren = <Statistics extends object>(
  node: Node<Statistics>,
  groupType: OverviewGroupTypeOrTaskDescription,
  sortChildren: (
    entries: [string, Node<Statistics>][],
  ) => [string, Node<Statistics>][],
) => sortChildren(Object.entries(node.getChildren(groupType) ?? {}));

export const getTaskDescriptionOrGroupSelectionPath = (
  path: StatisticsPath,
): OverviewSelectionPath => {
  const [groupType, key] = path[path.length - 1];
  return groupType === 'taskDescription' ? [[groupType, key]] : path;
};
