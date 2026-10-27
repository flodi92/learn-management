import { OverviewStatistics } from '../../overview/overview.model';

// Child lines (with a path) show their statistics behind the text.
// nodePath is the path of the node a line belongs to (a child line or the statistics and heading of a node).
export type Line = {
  depth: number;
  nodePath: string[];
  text: string;
  path?: string[];
  statistics?: OverviewStatistics;
};
