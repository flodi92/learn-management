import {
  OverviewGroupTypeOrTaskDescription,
  OverviewStatistics,
} from '../overview.model';

export interface OverviewStatisticsTree {
  statistics: OverviewStatistics;
  defaultGroupType?: OverviewGroupTypeOrTaskDescription;
  children?: Record<string | number, OverviewStatisticsTree>;
}
