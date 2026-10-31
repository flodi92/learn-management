import { statisticsExample } from '../../../overview/overview.utils/overview.computeStatistics.exampleData';
import { consoleDisplayStatistics } from './console.displayStatistics';
import { formatStatistics } from '../console.displayStatisticsItem.utils/console.formatStatistics';
import { getStatisticsColor } from '../console.displayStatisticsItem.utils/console.getStatisticsColor';
import { sortChildren } from '../console.displayStatisticsItem.utils/console.sortChildren';

consoleDisplayStatistics(
  statisticsExample,
  formatStatistics,
  getStatisticsColor,
  sortChildren,
);
