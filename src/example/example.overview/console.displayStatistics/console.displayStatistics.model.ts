// Child lines (with a path) show their statistics behind the text.

import {
  OverviewGroupTypeOrTaskDescription,
  OverviewSelectionPath,
} from '../../../overview/overview.model';
import { OverviewRecursiveUndeterminedStatistics } from '../../../overview/overview.utils/overview.computeStatistics.model';

export type StatisticsPath = OverviewSelectionPath;

// A heading is the focusable "<groupType> statistics" line of the node at path.
// With a detailIndex the focus is on that detail line of the node at path.
export type Focus = {
  path: StatisticsPath;
  isHeading: boolean;
  detailIndex?: number;
};

// nodePath is the path of the node a line belongs to (a child line or the statistics and heading of a node).
export type Line<Statistics extends object> = {
  depth: number;
  nodePath: StatisticsPath;
  text: string;
  path?: StatisticsPath;
  headingOf?: StatisticsPath;
  // Set for the detail lines of the child at this path.
  detailOf?: StatisticsPath;
  detailIndex?: number;
  statistics?: Statistics;
  // Set for the ellipsis line that stands for the not yet shown children of this node.
  hiddenChildrenOf?: StatisticsPath;
};

export type StatisticsFormatter<Statistics extends object> = (
  statistics: Statistics,
  isFocused: boolean,
) => string;

// The lines shown below an expanded child line, e.g. for a child without children. They can be focused, but neither selected nor expanded.
export type StatisticsDetailsFormatter<Statistics extends object> = (
  statistics: Statistics,
) => string[];

export type StatisticsColorer<Statistics extends object> = (
  statistics: Statistics,
) => (text: string) => string;

export type StatisticsSorter<Statistics extends object> = (
  entries: [
    string,
    OverviewRecursiveUndeterminedStatistics<
      Statistics,
      OverviewGroupTypeOrTaskDescription
    >,
  ][],
) => [
  string,
  OverviewRecursiveUndeterminedStatistics<
    Statistics,
    OverviewGroupTypeOrTaskDescription
  >,
][];
