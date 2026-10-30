import { statisticsExample } from '../../../overview/overview.utils/overview.computeStatistics.exampleData';
import { consoleDisplayStatistics } from './console.displayStatistics';
import {
  formatStatistics,
  getStatisticsColor,
  sortChildren,
} from '../console.displayStatisticsItem/console.displayStatisticsItem.utils';

consoleDisplayStatistics(
  statisticsExample,
  formatStatistics,
  getStatisticsColor,
  sortChildren,
);
