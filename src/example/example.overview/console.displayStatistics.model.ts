import { OverviewStatistics } from '../../overview/overview.model';

// Child lines (with a path) show their statistics behind the text.
export type Line = {
  depth: number;
  text: string;
  path?: string[];
  statistics?: OverviewStatistics;
};
