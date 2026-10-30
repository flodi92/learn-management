import { OverviewRecursiveUndeterminedStatistics } from '../../../overview/overview.model';
import { Line } from './console.displayStatistics.model';

export const indentation = (depth: number) => '  '.repeat(depth);

export const pathId = (path: string[]) => JSON.stringify(path);

const startsWith = (path: string[], prefix: string[]) =>
  prefix.every((key, index) => path[index] === key);

export const isHighlighted = <Statistics extends object>(
  line: Line<Statistics>,
  focus: string[],
): boolean =>
  line.hiddenChildrenOf
    ? false
    : line.path
      ? startsWith(focus, line.path)
      : focus.length > line.nodePath.length && startsWith(focus, line.nodePath);

const getLabel = (statistics: object): string | undefined => {
  const label = (statistics as { label?: unknown }).label;
  return typeof label === 'string' && label !== '' ? label : undefined;
};

export const getDisplayName = <Statistics extends object>(
  node: OverviewRecursiveUndeterminedStatistics<Statistics>,
  id: string,
): string => getLabel(node.statistics) ?? id;

export const getNode = <Statistics extends object>(
  root: OverviewRecursiveUndeterminedStatistics<Statistics>,
  path: string[],
): OverviewRecursiveUndeterminedStatistics<Statistics> | undefined =>
  path.reduce<OverviewRecursiveUndeterminedStatistics<Statistics> | undefined>(
    (node, key) => node?.children?.[key],
    root,
  );

export const getChildren = <Statistics extends object>(
  node: OverviewRecursiveUndeterminedStatistics<Statistics>,
  sortChildren: (
    entries: [string, OverviewRecursiveUndeterminedStatistics<Statistics>][],
  ) => [string, OverviewRecursiveUndeterminedStatistics<Statistics>][],
):
  | {
      childType: string;
      entries: [string, OverviewRecursiveUndeterminedStatistics<Statistics>][];
    }
  | undefined =>
  node.children !== undefined && node.groupType !== undefined
    ? {
        childType: node.groupType,
        entries: sortChildren(Object.entries(node.children)),
      }
    : undefined;
