// Child lines (with a path) show their statistics behind the text.

import { OverviewRecursiveUndeterminedStatistics } from '../../../overview/overview.model';

// nodePath is the path of the node a line belongs to (a child line or the statistics and heading of a node).
export type Line<Statistics extends object> = {
  depth: number;
  nodePath: string[];
  text: string;
  path?: string[];
  statistics?: Statistics;
  // Set for the ellipsis line that stands for the not yet shown children of this node.
  hiddenChildrenOf?: string[];
};

export type StatisticsFormatter<Statistics extends object> = (
  statistics: Statistics,
  isFocused: boolean,
) => string;

export type StatisticsColorer<Statistics extends object> = (
  statistics: Statistics,
) => (text: string) => string;

export type StatisticsSorter<Statistics extends object> = (
  entries: [string, OverviewRecursiveUndeterminedStatistics<Statistics>][],
) => [string, OverviewRecursiveUndeterminedStatistics<Statistics>][];
